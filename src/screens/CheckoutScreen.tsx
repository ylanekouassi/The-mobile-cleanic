import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../navigation/AppNavigator";
import { useCartStore } from "../state/cartStore";
import DateTimePicker from "@react-native-community/datetimepicker";

type CheckoutScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, "Checkout">;

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { items, getTotalPrice, clearCart } = useCartStore();

  // Address state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Date & Time state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (_: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = () => {
    if (!address || !city || !postalCode) {
      Alert.alert("Missing Information", "Please fill in all address fields.");
      return false;
    }
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      Alert.alert("Missing Information", "Please fill in all payment fields.");
      return false;
    }
    return true;
  };

  const handleConfirmBooking = () => {
    if (!validateForm()) return;

    Alert.alert(
      "Booking Confirmed!",
      "Your detailing service has been scheduled. We will send you a confirmation email shortly.",
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  const totalPrice = getTotalPrice();

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#0a0a0a", "#000000"]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cart" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryCard}>
              {items.map((item) => (
                <View key={`${item.packageId}-${item.vehicleType}`} style={styles.summaryItem}>
                  <Text style={styles.summaryItemName}>
                    {item.quantity}x {item.packageName}
                  </Text>
                  <Text style={styles.summaryItemPrice}>${item.finalPrice * item.quantity}</Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotalPrice}>${totalPrice}</Text>
              </View>
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Service Address</Text>
            </View>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main Street"
                placeholderTextColor="#555555"
                value={address}
                onChangeText={setAddress}
              />

              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="Montreal"
                placeholderTextColor="#555555"
                value={city}
                onChangeText={setCity}
              />

              <Text style={styles.inputLabel}>Postal Code</Text>
              <TextInput
                style={styles.input}
                placeholder="H1A 1A1"
                placeholderTextColor="#555555"
                value={postalCode}
                onChangeText={setPostalCode}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Date & Time Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Schedule</Text>
            </View>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Select Date</Text>
              <Pressable style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#E89A3C" />
                <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
              </Pressable>

              <Text style={styles.inputLabel}>Select Time</Text>
              <Pressable style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={20} color="#E89A3C" />
                <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>
          </View>

          {/* Payment Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Payment Information</Text>
            </View>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#555555"
                value={cardName}
                onChangeText={setCardName}
              />

              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#555555"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />

              <View style={styles.cardDetailsRow}>
                <View style={styles.cardDetailsItem}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#555555"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    maxLength={5}
                  />
                </View>

                <View style={styles.cardDetailsItem}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#555555"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Ionicons name="checkmark-circle" size={24} color="#000000" />
            <Text style={styles.confirmButtonText}>CONFIRM BOOKING</Text>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryItemName: {
    fontSize: 15,
    color: "#CCCCCC",
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E89A3C",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#1a1a1a",
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryTotalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E89A3C",
  },
  inputCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E89A3C",
    marginBottom: 8,
    marginTop: 12,
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
  dateTimeButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  dateTimeText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  cardDetailsRow: {
    flexDirection: "row",
    gap: 12,
  },
  cardDetailsItem: {
    flex: 1,
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
