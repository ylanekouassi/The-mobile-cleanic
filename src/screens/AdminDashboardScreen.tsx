import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_VIBECODE_BACKEND_URL || "http://localhost:3000";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  totalSpent: number;
  bookingCount: number;
  bookings: Booking[];
}

interface Booking {
  id: string;
  bookingDate: string;
  bookingTime: string;
  totalAmount: number;
  paymentStatus: string;
  packages: Package[];
}

interface Package {
  packageName: string;
  vehicleType: string;
  quantity: number;
  finalPrice: number;
}

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "customers">("schedule");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const session = await AsyncStorage.getItem("adminSession");
    if (!session) {
      navigation.navigate("AdminLogin" as never);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsRes = await fetch(`${BACKEND_URL}/api/admin/bookings`);
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.bookings);
      }

      // Fetch customers
      const customersRes = await fetch(`${BACKEND_URL}/api/admin/customers`);
      const customersData = await customersRes.json();
      if (customersData.success) {
        setCustomers(customersData.customers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("adminSession");
          navigation.navigate("Home" as never);
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getBookingsForDate = (date: string) => {
    const targetDate = new Date(date).toDateString();
    return bookings.filter(
      (booking) => new Date(booking.bookingDate).toDateString() === targetDate
    );
  };

  const getDateBookingStats = (date: string) => {
    const dateBookings = getBookingsForDate(date);
    const totalCustomers = dateBookings.length;
    const totalPackages = dateBookings.reduce(
      (sum, booking) =>
        sum + booking.packages.reduce((pkgSum: number, pkg: any) => pkgSum + pkg.quantity, 0),
      0
    );
    return { totalCustomers, totalPackages };
  };

  const renderScheduleTab = () => {
    // Group bookings by date
    const bookingsByDate: { [key: string]: any[] } = {};
    bookings.forEach((booking) => {
      const dateKey = new Date(booking.bookingDate).toDateString();
      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }
      bookingsByDate[dateKey].push(booking);
    });

    // Sort dates
    const sortedDates = Object.keys(bookingsByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E89A3C" />}
      >
        {sortedDates.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#666666" />
            <Text style={styles.emptyText}>No bookings scheduled</Text>
          </View>
        ) : (
          sortedDates.map((dateKey) => {
            const dateBookings = bookingsByDate[dateKey];
            const stats = getDateBookingStats(dateKey);

            return (
              <View key={dateKey} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateText}>{formatDate(dateKey)}</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statBadge}>
                      <Ionicons name="people" size={14} color="#E89A3C" />
                      <Text style={styles.statText}>{stats.totalCustomers}/2</Text>
                    </View>
                    <View style={styles.statBadge}>
                      <Ionicons name="cube" size={14} color="#E89A3C" />
                      <Text style={styles.statText}>{stats.totalPackages}/2</Text>
                    </View>
                  </View>
                </View>

                {dateBookings.map((booking) => (
                  <Pressable
                    key={booking.id}
                    style={styles.bookingCard}
                    onPress={() =>
                      setExpandedBooking(expandedBooking === booking.id ? null : booking.id)
                    }
                  >
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingTimeContainer}>
                        <Ionicons name="time" size={18} color="#E89A3C" />
                        <Text style={styles.bookingTime}>{booking.bookingTime}</Text>
                      </View>
                      <Ionicons
                        name={expandedBooking === booking.id ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#888888"
                      />
                    </View>

                    <View style={styles.customerInfo}>
                      <Ionicons name="person" size={16} color="#666666" />
                      <Text style={styles.customerName}>{booking.customer.fullName}</Text>
                    </View>

                    <View style={styles.customerInfo}>
                      <Ionicons name="call" size={16} color="#666666" />
                      <Text style={styles.customerDetail}>{booking.customer.phone}</Text>
                    </View>

                    {expandedBooking === booking.id && (
                      <View style={styles.expandedContent}>
                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                          <Ionicons name="mail" size={16} color="#666666" />
                          <Text style={styles.detailText}>{booking.customer.email}</Text>
                        </View>

                        <View style={styles.detailRow}>
                          <Ionicons name="location" size={16} color="#666666" />
                          <Text style={styles.detailText}>
                            {booking.customer.streetAddress}, {booking.customer.city},{" "}
                            {booking.customer.postalCode}
                          </Text>
                        </View>

                        <View style={styles.packagesSection}>
                          <Text style={styles.sectionTitle}>Services:</Text>
                          {booking.packages.map((pkg: any, index: number) => (
                            <View key={index} style={styles.packageItem}>
                              <Text style={styles.packageName}>
                                • {pkg.packageName} ({pkg.vehicleType})
                              </Text>
                              <Text style={styles.packagePrice}>
                                {formatCurrency(pkg.finalPrice)} x{pkg.quantity}
                              </Text>
                            </View>
                          ))}
                        </View>

                        <View style={styles.totalRow}>
                          <Text style={styles.totalLabel}>Total:</Text>
                          <Text style={styles.totalAmount}>
                            {formatCurrency(booking.totalAmount)}
                          </Text>
                        </View>

                        <View style={[
                          styles.statusBadge,
                          booking.paymentStatus === "completed" && styles.statusBadgeCompleted
                        ]}>
                          <Text style={styles.statusText}>
                            {booking.paymentStatus === "completed"
                              ? "✓ Job Completed"
                              : booking.paymentStatus === "reservation_paid"
                              ? "Reservation Paid"
                              : booking.paymentStatus}
                          </Text>
                        </View>

                        {booking.paymentStatus !== "completed" && (
                          <Pressable
                            style={styles.completeButton}
                            onPress={async () => {
                              try {
                                const response = await fetch(
                                  `${BACKEND_URL}/api/admin/bookings/${booking.id}/complete`,
                                  { method: "PUT" }
                                );
                                const data = await response.json();
                                if (data.success) {
                                  Alert.alert("Success", "Booking marked as completed!");
                                  fetchData(); // Refresh data
                                } else {
                                  Alert.alert("Error", "Failed to update booking");
                                }
                              } catch (error) {
                                Alert.alert("Error", "Could not connect to server");
                              }
                            }}
                          >
                            <Ionicons name="checkmark-circle" size={20} color="#000000" />
                            <Text style={styles.completeButtonText}>MARK AS COMPLETED</Text>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    );
  };

  const renderCustomersTab = () => {
    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E89A3C" />}
      >
        {/* Add Customer Button */}
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("AddCustomer" as never)}
        >
          <Ionicons name="person-add" size={20} color="#000000" />
          <Text style={styles.addButtonText}>ADD NEW CUSTOMER</Text>
        </Pressable>

        {customers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={60} color="#666666" />
            <Text style={styles.emptyText}>No customers yet</Text>
          </View>
        ) : (
          customers.map((customer) => (
            <Pressable
              key={customer.id}
              style={styles.customerCard}
              onPress={() =>
                setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)
              }
            >
              <View style={styles.customerCardHeader}>
                <View>
                  <Text style={styles.customerCardName}>{customer.fullName}</Text>
                  <Text style={styles.customerCardEmail}>{customer.email}</Text>
                </View>
                <Ionicons
                  name={expandedCustomer === customer.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#888888"
                />
              </View>

              <View style={styles.customerStats}>
                <View style={styles.customerStat}>
                  <Text style={styles.customerStatValue}>{customer.bookingCount}</Text>
                  <Text style={styles.customerStatLabel}>Bookings</Text>
                </View>
                <View style={styles.customerStat}>
                  <Text style={styles.customerStatValue}>
                    {formatCurrency(customer.totalSpent)}
                  </Text>
                  <Text style={styles.customerStatLabel}>Total Spent</Text>
                </View>
              </View>

              {expandedCustomer === customer.id && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Ionicons name="call" size={16} color="#666666" />
                    <Text style={styles.detailText}>{customer.phone}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#666666" />
                    <Text style={styles.detailText}>
                      {customer.streetAddress}, {customer.city}, {customer.postalCode}
                    </Text>
                  </View>

                  {/* Add Booking Button */}
                  <Pressable
                    style={styles.addBookingButton}
                    onPress={() => {
                      (navigation as any).navigate("AddBooking", {
                        customerId: customer.id,
                      });
                    }}
                  >
                    <Ionicons name="calendar-outline" size={18} color="#000000" />
                    <Text style={styles.addBookingButtonText}>CREATE BOOKING</Text>
                  </Pressable>

                  <Text style={styles.sectionTitle}>Booking History:</Text>
                  {customer.bookings.map((booking) => (
                    <View key={booking.id} style={styles.historyItem}>
                      <Text style={styles.historyDate}>{formatDate(booking.bookingDate)}</Text>
                      <Text style={styles.historyAmount}>
                        {formatCurrency(booking.totalAmount)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E89A3C" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Mobile Cleanic Management</Text>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#E89A3C" />
        </Pressable>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#E89A3C" />
          <Text style={styles.statValue}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
          <Text style={styles.statValue}>
            {bookings.filter((b) => b.paymentStatus === "completed").length}
          </Text>
          <Text style={styles.statLabel}>Jobs Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#E89A3C" />
          <Text style={styles.statValue}>{customers.length}</Text>
          <Text style={styles.statLabel}>Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#E89A3C" />
          <Text style={styles.statValue}>
            {formatCurrency(
              customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
            )}
          </Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === "schedule" && styles.tabActive]}
          onPress={() => setActiveTab("schedule")}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === "schedule" ? "#E89A3C" : "#666666"}
          />
          <Text
            style={[styles.tabText, activeTab === "schedule" && styles.tabTextActive]}
          >
            Schedule
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "customers" && styles.tabActive]}
          onPress={() => setActiveTab("customers")}
        >
          <Ionicons
            name="people"
            size={20}
            color={activeTab === "customers" ? "#E89A3C" : "#666666"}
          />
          <Text
            style={[styles.tabText, activeTab === "customers" && styles.tabTextActive]}
          >
            Customers
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      {activeTab === "schedule" ? renderScheduleTab() : renderCustomersTab()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888888",
    marginTop: 15,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#888888",
    marginTop: 4,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  tabActive: {
    backgroundColor: "#2a2a2a",
    borderColor: "#E89A3C",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  tabTextActive: {
    color: "#E89A3C",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 15,
  },
  dateGroup: {
    marginBottom: 25,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E89A3C",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bookingCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bookingTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookingTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  customerDetail: {
    fontSize: 14,
    color: "#888888",
  },
  expandedContent: {
    marginTop: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    color: "#CCCCCC",
  },
  packagesSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E89A3C",
    marginBottom: 8,
    marginTop: 10,
  },
  packageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  packageName: {
    fontSize: 13,
    color: "#CCCCCC",
  },
  packagePrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E89A3C",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2a4a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 10,
  },
  statusBadgeCompleted: {
    backgroundColor: "#1a4a1a",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4ade80",
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E89A3C",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 15,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
  customerCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333333",
  },
  customerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  customerCardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  customerCardEmail: {
    fontSize: 13,
    color: "#888888",
    marginTop: 2,
  },
  customerStats: {
    flexDirection: "row",
    gap: 15,
  },
  customerStat: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  customerStatValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E89A3C",
  },
  customerStatLabel: {
    fontSize: 11,
    color: "#666666",
    marginTop: 4,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  historyDate: {
    fontSize: 13,
    color: "#CCCCCC",
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
  addBookingButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  addBookingButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.5,
  },
});
