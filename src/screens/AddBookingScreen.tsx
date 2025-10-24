import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

const BACKEND_URL = process.env.EXPO_PUBLIC_VIBECODE_BACKEND_URL || "http://localhost:3000";

interface Package {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
}

type RouteParams = {
  AddBooking: {
    customerId: string;
  };
};

const PACKAGES: Package[] = [
  { id: "1", name: "Interior Basic", price: 99, category: "Interior" },
  { id: "2", name: "Interior Premium", price: 189, category: "Interior" },
  { id: "3", name: "Seat Shampooing", price: 99, category: "Interior" },
  { id: "4", name: "Stage 1 Paint Correction", price: 250, category: "Paint Correction" },
  { id: "5", name: "Stage 2 Paint Correction", price: 450, category: "Paint Correction" },
  { id: "6", name: "Stage 3 Paint Correction", price: 800, category: "Paint Correction" },
  { id: "7", name: "Full Detail", price: 299, category: "In-N-Out" },
];

const VEHICLE_TYPES = [
  { id: "sedan", name: "Sedan", surcharge: 0 },
  { id: "suv", name: "SUV", surcharge: 25 },
  { id: "van", name: "Van", surcharge: 50 },
];

const TIME_SLOTS = [
  "7:00 AM", "7:30 AM", "8:00 AM", "9:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

export default function AddBookingScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'AddBooking'>>();
  const customerId = route.params?.customerId;

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Booking form state
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("e_transfer");

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/customers/${customerId}`);
      const data = await response.json();
      if (data.success) {
        setCustomer(data.customer);
      }
    } catch (error) {
      console.error("Fetch customer error:", error);
    }
  };

  const calculateTotal = () => {
    if (!selectedPackage || !selectedVehicleType) return 0;
    const vehicleSurcharge = VEHICLE_TYPES.find((v) => v.id === selectedVehicleType)?.surcharge || 0;
    const qty = parseInt(quantity) || 1;
    return (selectedPackage.price + vehicleSurcharge) * qty;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const validateForm = () => {
    if (!selectedPackage) {
      Alert.alert("Missing Selection", "Please select a package");
      return false;
    }
    if (!selectedVehicleType) {
      Alert.alert("Missing Selection", "Please select vehicle type");
      return false;
    }
    if (!selectedTime) {
      Alert.alert("Missing Selection", "Please select a time slot");
      return false;
    }
    return true;
  };

  const handleCreateBooking = async () => {
    if (!validateForm() || !customer || !selectedPackage) return;

    setLoading(true);

    try {
      const vehicleSurcharge = VEHICLE_TYPES.find((v) => v.id === selectedVehicleType)?.surcharge || 0;
      const finalPrice = selectedPackage.price + vehicleSurcharge;
      const qty = parseInt(quantity) || 1;
      const serviceTotal = finalPrice * qty;

      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            streetAddress: customer.streetAddress,
            city: customer.city,
            postalCode: customer.postalCode,
          },
          bookingDate: selectedDate.toISOString(),
          bookingTime: selectedTime,
          paymentMethod,
          serviceTotal,
          packages: [
            {
              packageId: selectedPackage.id,
              packageName: selectedPackage.name,
              vehicleType: selectedVehicleType,
              basePrice: selectedPackage.price,
              finalPrice,
              quantity: qty,
            },
          ],
          message: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Booking created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to create booking");
      }
    } catch (error) {
      console.error("Create booking error:", error);
      Alert.alert("Connection Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E89A3C" />
          <Text style={styles.loadingText}>Loading customer...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="calendar-outline" size={48} color="#E89A3C" />
          <Text style={styles.title}>Create Booking</Text>
          <Text style={styles.subtitle}>For {customer.fullName}</Text>
        </View>

        {/* Package Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Package *</Text>
          {PACKAGES.map((pkg) => (
            <Pressable
              key={pkg.id}
              style={[
                styles.optionCard,
                selectedPackage?.id === pkg.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedPackage(pkg)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionName}>{pkg.name}</Text>
                <Text style={styles.optionCategory}>{pkg.category}</Text>
              </View>
              <Text style={styles.optionPrice}>${pkg.price}</Text>
            </Pressable>
          ))}
        </View>

        {/* Vehicle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Vehicle Type *</Text>
          <View style={styles.vehicleGrid}>
            {VEHICLE_TYPES.map((vehicle) => (
              <Pressable
                key={vehicle.id}
                style={[
                  styles.vehicleCard,
                  selectedVehicleType === vehicle.id && styles.vehicleCardSelected,
                ]}
                onPress={() => setSelectedVehicleType(vehicle.id)}
              >
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.vehicleSurcharge}>
                  {vehicle.surcharge === 0 ? "Base" : `+$${vehicle.surcharge}`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="1"
            placeholderTextColor="#666666"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date *</Text>
          <Pressable onPress={() => setShowDatePicker(!showDatePicker)}>
            <View style={styles.dateButton}>
              <Ionicons name="calendar-outline" size={20} color="#E89A3C" />
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              <Ionicons
                name={showDatePicker ? "chevron-up" : "chevron-down"}
                size={20}
                color="#E89A3C"
              />
            </View>
          </Pressable>

          {showDatePicker && (
            <View style={styles.calendarContainer}>
              <Calendar
                current={selectedDate.toISOString().split("T")[0]}
                onDayPress={(day) => {
                  setSelectedDate(new Date(day.dateString));
                  setShowDatePicker(false);
                }}
                minDate={new Date().toISOString().split("T")[0]}
                markedDates={{
                  [selectedDate.toISOString().split("T")[0]]: {
                    selected: true,
                    selectedColor: "#E89A3C",
                  },
                }}
                theme={{
                  backgroundColor: "#0f0f0f",
                  calendarBackground: "#0f0f0f",
                  textSectionTitleColor: "#E89A3C",
                  selectedDayBackgroundColor: "#E89A3C",
                  selectedDayTextColor: "#000000",
                  todayTextColor: "#E89A3C",
                  dayTextColor: "#FFFFFF",
                  textDisabledColor: "#444444",
                  monthTextColor: "#FFFFFF",
                  arrowColor: "#E89A3C",
                }}
              />
            </View>
          )}
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time *</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <Pressable
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === "credit_card" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("credit_card")}
          >
            <Ionicons
              name="card"
              size={24}
              color={paymentMethod === "credit_card" ? "#000000" : "#E89A3C"}
            />
            <Text
              style={[
                styles.paymentText,
                paymentMethod === "credit_card" && styles.paymentTextSelected,
              ]}
            >
              Credit Card
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === "e_transfer" && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod("e_transfer")}
          >
            <Ionicons
              name="mail"
              size={24}
              color={paymentMethod === "e_transfer" ? "#000000" : "#E89A3C"}
            />
            <Text
              style={[
                styles.paymentText,
                paymentMethod === "e_transfer" && styles.paymentTextSelected,
              ]}
            >
              E-Transfer
            </Text>
          </Pressable>
        </View>

        {/* Total */}
        {selectedPackage && selectedVehicleType && (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
        )}

        {/* Create Button */}
        <Pressable
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#000000" />
              <Text style={styles.createButtonText}>CREATE BOOKING</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
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
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    marginTop: 5,
  },
  section: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E89A3C",
    marginBottom: 15,
  },
  optionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#333333",
  },
  optionCardSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  optionCategory: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  vehicleGrid: {
    flexDirection: "row",
    gap: 10,
  },
  vehicleCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#333333",
  },
  vehicleCardSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  vehicleSurcharge: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    gap: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  calendarContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  timeSlotSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  timeTextSelected: {
    color: "#000000",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#333333",
    gap: 15,
  },
  paymentOptionSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  paymentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  paymentTextSelected: {
    color: "#000000",
  },
  totalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E89A3C",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E89A3C",
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
