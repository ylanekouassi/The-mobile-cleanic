import { Hono } from "hono";
import { cors } from "hono/cors";
import prisma from "./db";

const app = new Hono();

// Enable CORS for React Native app
app.use("/*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Health check
app.get("/", (c) => {
  return c.json({ message: "Mobile Cleanic API is running!" });
});

// ==================== ADMIN ROUTES ====================

// Admin login
app.post("/api/admin/login", async (c) => {
  const { username, password } = await c.req.json();

  if (username === "ylanekouassi" && password === "Algoma2021@!") {
    return c.json({
      success: true,
      message: "Login successful",
      admin: {
        username: "ylanekouassi",
        role: "admin",
      },
    });
  }

  return c.json({ success: false, message: "Invalid credentials" }, 401);
});

// Get all bookings with customer info
app.get("/api/admin/bookings", async (c) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        packages: true,
      },
      orderBy: {
        bookingDate: "asc",
      },
    });

    return c.json({ success: true, bookings });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch bookings" }, 500);
  }
});

// Get bookings for a specific date
app.get("/api/admin/bookings/:date", async (c) => {
  const dateStr = c.req.param("date");
  const date = new Date(dateStr);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        customer: true,
        packages: true,
      },
    });

    return c.json({ success: true, bookings });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch bookings" }, 500);
  }
});

// Get customer statistics
app.get("/api/admin/customers", async (c) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        bookings: {
          include: {
            packages: true,
          },
        },
      },
    });

    // Calculate total spent for each customer
    const customersWithStats = customers.map((customer) => {
      const totalSpent = customer.bookings.reduce(
        (sum, booking) => sum + booking.totalAmount,
        0
      );
      const bookingCount = customer.bookings.length;

      return {
        ...customer,
        totalSpent,
        bookingCount,
      };
    });

    return c.json({ success: true, customers: customersWithStats });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch customers" }, 500);
  }
});

// Get single customer details
app.get("/api/admin/customers/:id", async (c) => {
  const customerId = c.req.param("id");

  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        bookings: {
          include: {
            packages: true,
          },
          orderBy: {
            bookingDate: "desc",
          },
        },
      },
    });

    if (!customer) {
      return c.json({ success: false, error: "Customer not found" }, 404);
    }

    const totalSpent = customer.bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    return c.json({
      success: true,
      customer: {
        ...customer,
        totalSpent,
      },
    });
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch customer" }, 500);
  }
});

// Mark booking as completed
app.put("/api/admin/bookings/:id/complete", async (c) => {
  const bookingId = c.req.param("id");

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "completed",
      },
      include: {
        customer: true,
        packages: true,
      },
    });

    return c.json({
      success: true,
      booking,
      message: "Booking marked as completed",
    });
  } catch (error) {
    return c.json({ success: false, error: "Failed to update booking" }, 500);
  }
});

// ==================== BOOKING ROUTES ====================

// Check availability for a specific date
app.get("/api/bookings/availability/:date", async (c) => {
  const dateStr = c.req.param("date");
  const date = new Date(dateStr);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        packages: true,
      },
    });

    // Count total customers for the day
    const totalCustomers = bookings.length;

    // Count total packages for the day
    const totalPackages = bookings.reduce(
      (sum, booking) =>
        sum +
        booking.packages.reduce((pkgSum, pkg) => pkgSum + pkg.quantity, 0),
      0
    );

    const isAvailable = totalCustomers < 2 && totalPackages < 2;

    return c.json({
      success: true,
      available: isAvailable,
      totalCustomers,
      totalPackages,
      maxCustomers: 2,
      maxPackages: 2,
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to check availability" },
      500
    );
  }
});

// Create a new booking
app.post("/api/bookings", async (c) => {
  try {
    const bookingData = await c.req.json();

    // First check availability
    const date = new Date(bookingData.bookingDate);
    const existingBookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        packages: true,
      },
    });

    const totalCustomers = existingBookings.length;
    const totalPackages = existingBookings.reduce(
      (sum, booking) =>
        sum +
        booking.packages.reduce((pkgSum, pkg) => pkgSum + pkg.quantity, 0),
      0
    );

    const newPackageCount = bookingData.packages.reduce(
      (sum: number, pkg: any) => sum + pkg.quantity,
      0
    );

    // Check if adding this booking would exceed limits
    if (totalCustomers >= 2) {
      return c.json(
        {
          success: false,
          error:
            "Maximum 2 customers per day reached. Please choose another date.",
        },
        400
      );
    }

    if (totalPackages + newPackageCount > 2) {
      return c.json(
        {
          success: false,
          error:
            "Maximum 2 packages per day reached. Please choose another date.",
        },
        400
      );
    }

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: {
        email: bookingData.customer.email,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName: bookingData.customer.firstName,
          lastName: bookingData.customer.lastName,
          fullName: bookingData.customer.fullName,
          email: bookingData.customer.email,
          phone: bookingData.customer.phone,
          streetAddress: bookingData.customer.streetAddress,
          city: bookingData.customer.city,
          postalCode: bookingData.customer.postalCode,
        },
      });
    }

    // Create booking with packages
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        bookingDate: new Date(bookingData.bookingDate),
        bookingTime: bookingData.bookingTime,
        paymentMethod: bookingData.paymentMethod,
        reservationFee: 30,
        serviceTotal: bookingData.serviceTotal,
        totalAmount: bookingData.serviceTotal + 30,
        paymentStatus: "reservation_paid",
        message: bookingData.message || null,
        packages: {
          create: bookingData.packages.map((pkg: any) => ({
            packageId: pkg.packageId,
            packageName: pkg.packageName,
            vehicleType: pkg.vehicleType,
            basePrice: pkg.basePrice,
            finalPrice: pkg.finalPrice,
            quantity: pkg.quantity,
          })),
        },
      },
      include: {
        customer: true,
        packages: true,
      },
    });

    return c.json({
      success: true,
      booking,
      message: "Booking created successfully!",
    });
  } catch (error) {
    console.error("Booking error:", error);
    return c.json({ success: false, error: "Failed to create booking" }, 500);
  }
});

// Start server
const port = process.env.PORT || 3000;

console.log(`🚀 Server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
