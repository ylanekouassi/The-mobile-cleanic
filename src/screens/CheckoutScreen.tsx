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

type PaymentMethod = "credit-card" | "e-transfer";

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { items, getTotalPrice, clearCart } = useCartStore();

  // Contact state
  const [contactEmail, setContactEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");

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
    if (!contactEmail || !fullName || !phone) {
      Alert.alert("Missing Information", "Please fill in your contact information.");
      return false;
    }
    if (!address || !city || !postalCode) {
      Alert.alert("Missing Information", "Please fill in all address fields.");
      return false;
    }
    if (!paymentMethod) {
      Alert.alert("Missing Information", "Please select a payment method.");
      return false;
    }
    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        Alert.alert("Missing Information", "Please fill in all payment fields.");
        return false;
      }
    } else if (paymentMethod === "e-transfer") {
      if (!email) {
        Alert.alert("Missing Information", "Please provide your email for e-transfer instructions.");
        return false;
      }
    }
    return true;
  };

  const handleConfirmBooking = () => {
    if (!validateForm()) return;

    const paymentText = paymentMethod === "credit-card" 
      ? "Your $30 reservation fee has been charged to your card."
      : "We will send e-transfer instructions to your email for the $30 reservation fee.";

    Alert.alert(
      "Booking Confirmed!",
      `Your detailing service has been scheduled for ${formatDate(selectedDate)} at ${formatTime(selectedTime)}.\n\n${paymentText}\n\nThe remaining $${totalPrice - 30} will be due after service completion.\n\nA confirmation email with booking details, receipt, and our policies has been sent to ${contactEmail}.`,
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
                <Text style={styles.summaryLabel}>Service Total:</Text>
                <Text style={styles.summaryValue}>${totalPrice}</Text>
              </View>
              <View style={styles.reservationFeeNotice}>
                <Ionicons name="information-circle" size={18} color="#E89A3C" />
                <Text style={styles.reservationFeeText}>
                  $30 reservation fee • Remaining ${totalPrice - 30} due after service
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryTotal}>Due Today:</Text>
                <Text style={styles.summaryTotalPrice}>$30</Text>
              </View>
            </View>
          </View>

          {/* Contact Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#555555"
                value={fullName}
                onChangeText={setFullName}
              />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#555555"
                value={contactEmail}
                onChangeText={setContactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="(514) 123-4567"
                placeholderTextColor="#555555"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <View style={styles.emailNotice}>
                <Ionicons name="mail-outline" size={18} color="#E89A3C" />
                <Text style={styles.emailNoticeText}>
                  Confirmation email with booking details, receipt, and policies will be sent to this address
                </Text>
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
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            
            {/* Payment Method Selection */}
            <View style={styles.inputCard}>
              <Text style={styles.paymentMethodTitle}>Select Payment Method</Text>
              
              <Pressable
                style={[
                  styles.paymentMethodOption,
                  paymentMethod === "credit-card" && styles.paymentMethodOptionSelected,
                ]}
                onPress={() => setPaymentMethod("credit-card")}
              >
                <View style={styles.paymentMethodContent}>
                  <Ionicons 
                    name="card" 
                    size={32} 
                    color={paymentMethod === "credit-card" ? "#000000" : "#E89A3C"} 
                  />
                  <View style={styles.paymentMethodText}>
                    <Text style={[
                      styles.paymentMethodTitle,
                      paymentMethod === "credit-card" && styles.paymentMethodTitleSelected
                    ]}>
                      Credit Card
                    </Text>
                    <Text style={[
                      styles.paymentMethodDescription,
                      paymentMethod === "credit-card" && styles.paymentMethodDescriptionSelected
                    ]}>
                      Pay $30 reservation fee now
                    </Text>
                  </View>
                </View>
                {paymentMethod === "credit-card" && (
                  <Ionicons name="checkmark-circle" size={24} color="#000000" />
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.paymentMethodOption,
                  paymentMethod === "e-transfer" && styles.paymentMethodOptionSelected,
                ]}
                onPress={() => setPaymentMethod("e-transfer")}
              >
                <View style={styles.paymentMethodContent}>
                  <Ionicons 
                    name="mail" 
                    size={32} 
                    color={paymentMethod === "e-transfer" ? "#000000" : "#E89A3C"} 
                  />
                  <View style={styles.paymentMethodText}>
                    <Text style={[
                      styles.paymentMethodTitle,
                      paymentMethod === "e-transfer" && styles.paymentMethodTitleSelected
                    ]}>
                      E-Transfer
                    </Text>
                    <Text style={[
                      styles.paymentMethodDescription,
                      paymentMethod === "e-transfer" && styles.paymentMethodDescriptionSelected
                    ]}>
                      Receive instructions by email
                    </Text>
                  </View>
                </View>
                {paymentMethod === "e-transfer" && (
                  <Ionicons name="checkmark-circle" size={24} color="#000000" />
                )}
              </Pressable>

              {/* Credit Card Fields */}
              {paymentMethod === "credit-card" && (
                <View style={styles.paymentFields}>
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
              )}

              {/* E-Transfer Email Field */}
              {paymentMethod === "e-transfer" && (
                <View style={styles.paymentFields}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor="#555555"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.eTransferNotice}>
                    <Ionicons name="information-circle" size={18} color="#E89A3C" />
                    <Text style={styles.eTransferText}>
                      We will send you e-transfer instructions to complete the $30 reservation fee
                    </Text>
                  </View>
                </View>
              )}
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
  summaryLabel: {
    fontSize: 15,
    color: "#888888",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  reservationFeeNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  reservationFeeText: {
    fontSize: 12,
    color: "#E89A3C",
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
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
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  paymentMethodOption: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#333333",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentMethodOptionSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  paymentMethodContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  paymentMethodText: {
    flex: 1,
  },
  paymentMethodTitleSelected: {
    color: "#000000",
  },
  paymentMethodDescription: {
    fontSize: 13,
    color: "#888888",
    marginTop: 4,
  },
  paymentMethodDescriptionSelected: {
    color: "#000000",
  },
  paymentFields: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  eTransferNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  eTransferText: {
    fontSize: 12,
    color: "#E89A3C",
    flex: 1,
    lineHeight: 18,
  },
  emailNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  emailNoticeText: {
    fontSize: 12,
    color: "#E89A3C",
    flex: 1,
    lineHeight: 18,
    fontWeight: "500",
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
