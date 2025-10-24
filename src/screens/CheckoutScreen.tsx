import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../navigation/AppNavigator";
import { useCartStore } from "../state/cartStore";
import { Calendar } from "react-native-calendars";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

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
  const [selectedTime, setSelectedTime] = useState<"morning" | "afternoon">("morning");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Copy state
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = async () => {
    await Clipboard.setStringAsync("themobilecleanic@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
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

  const formatTime = (time: "morning" | "afternoon") => {
    return time === "morning" ? "7:30 AM" : "1:00 PM";
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
    }
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare booking data
      const bookingData = {
        customer: {
          firstName,
          lastName,
          fullName: fullName.trim(),
          email: contactEmail.trim(),
          phone: phone.trim(),
          streetAddress: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
        },
        bookingDate: selectedDate.toISOString(),
        bookingTime: formatTime(selectedTime),
        paymentMethod: paymentMethod === "credit-card" ? "credit_card" : "e_transfer",
        serviceTotal: totalPrice,
        packages: items.map((item) => ({
          packageId: item.packageId,
          packageName: item.packageName,
          vehicleType: item.vehicleType,
          basePrice: item.basePrice,
          finalPrice: item.finalPrice,
          quantity: item.quantity,
        })),
        message: null,
      };

      // Send booking to backend
      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Booking Failed", data.error || "Could not create booking. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Success!
      const paymentText =
        paymentMethod === "credit-card"
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
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert(
        "Connection Error",
        "Could not connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <Pressable onPress={() => setShowDatePicker(!showDatePicker)}>
                <Text style={styles.inputLabel}>Select Date</Text>
                <View style={styles.dateTimeButton}>
                  <Ionicons name="calendar-outline" size={20} color="#E89A3C" />
                  <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
                  <Ionicons 
                    name={showDatePicker ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#E89A3C" 
                    style={{ marginLeft: "auto" }}
                  />
                </View>
              </Pressable>

              {showDatePicker && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    current={selectedDate.toISOString().split('T')[0]}
                    onDayPress={(day) => {
                      setSelectedDate(new Date(day.dateString));
                      setShowDatePicker(false);
                    }}
                    minDate={new Date().toISOString().split('T')[0]}
                    markedDates={{
                      [selectedDate.toISOString().split('T')[0]]: {
                        selected: true,
                        selectedColor: '#E89A3C',
                      },
                    }}
                    theme={{
                      backgroundColor: '#0f0f0f',
                      calendarBackground: '#0f0f0f',
                      textSectionTitleColor: '#E89A3C',
                      selectedDayBackgroundColor: '#E89A3C',
                      selectedDayTextColor: '#000000',
                      todayTextColor: '#E89A3C',
                      dayTextColor: '#FFFFFF',
                      textDisabledColor: '#444444',
                      monthTextColor: '#FFFFFF',
                      arrowColor: '#E89A3C',
                      textDayFontWeight: '500',
                      textMonthFontWeight: '700',
                      textDayHeaderFontWeight: '600',
                    }}
                  />
                </View>
              )}

              <Text style={styles.inputLabel}>Select Time</Text>
              <View style={styles.timeOptionsContainer}>
                <Pressable
                  style={[
                    styles.timeOption,
                    selectedTime === "morning" && styles.timeOptionSelected,
                  ]}
                  onPress={() => setSelectedTime("morning")}
                >
                  <Ionicons 
                    name="sunny-outline" 
                    size={24} 
                    color={selectedTime === "morning" ? "#000000" : "#E89A3C"} 
                  />
                  <Text style={[
                    styles.timeOptionText,
                    selectedTime === "morning" && styles.timeOptionTextSelected
                  ]}>
                    7:30 AM
                  </Text>
                  <Text style={[
                    styles.timeOptionLabel,
                    selectedTime === "morning" && styles.timeOptionLabelSelected
                  ]}>
                    Morning
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.timeOption,
                    selectedTime === "afternoon" && styles.timeOptionSelected,
                  ]}
                  onPress={() => setSelectedTime("afternoon")}
                >
                  <Ionicons 
                    name="partly-sunny-outline" 
                    size={24} 
                    color={selectedTime === "afternoon" ? "#000000" : "#E89A3C"} 
                  />
                  <Text style={[
                    styles.timeOptionText,
                    selectedTime === "afternoon" && styles.timeOptionTextSelected
                  ]}>
                    1:00 PM
                  </Text>
                  <Text style={[
                    styles.timeOptionLabel,
                    selectedTime === "afternoon" && styles.timeOptionLabelSelected
                  ]}>
                    Afternoon
                  </Text>
                </Pressable>
              </View>
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

              {/* E-Transfer Instructions */}
              {paymentMethod === "e-transfer" && (
                <View style={styles.paymentFields}>
                  <View style={styles.eTransferInstructions}>
                    <View style={styles.eTransferHeader}>
                      <Ionicons name="mail" size={32} color="#E89A3C" />
                      <Text style={styles.eTransferTitle}>E-Transfer Instructions</Text>
                    </View>

                    <View style={styles.eTransferStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                      </View>
                      <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Send E-Transfer</Text>
                        <Text style={styles.stepDescription}>
                          Send $30.00 via Interac e-Transfer to:
                        </Text>
                        <Pressable 
                          style={styles.emailBox}
                          onPress={handleCopyEmail}
                        >
                          <Ionicons name="mail-outline" size={20} color="#E89A3C" />
                          <Text style={styles.emailText}>themobilecleanic@gmail.com</Text>
                          <Ionicons 
                            name={copied ? "checkmark-circle" : "copy-outline"} 
                            size={18} 
                            color={copied ? "#E89A3C" : "#888888"} 
                          />
                        </Pressable>
                        {copied && (
                          <Text style={styles.copiedText}>✓ Copié!</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.eTransferStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                      </View>
                      <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Add Message</Text>
                        <Text style={styles.stepDescription}>
                          Include your name and phone number in the e-Transfer message
                        </Text>
                      </View>
                    </View>

                    <View style={styles.eTransferStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                      </View>
                      <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Auto-Deposit</Text>
                        <Text style={styles.stepDescription}>
                          No password required - funds will be deposited automatically
                        </Text>
                      </View>
                    </View>

                    <View style={styles.eTransferWarning}>
                      <Ionicons name="alert-circle" size={20} color="#E89A3C" />
                      <Text style={styles.eTransferWarningText}>
                        Your booking will be confirmed once we receive your e-Transfer (usually within 5-10 minutes)
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable
            style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
            onPress={handleConfirmBooking}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#000000" />
                <Text style={styles.confirmButtonText}>PROCESSING...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#000000" />
                <Text style={styles.confirmButtonText}>CONFIRM BOOKING</Text>
              </>
            )}
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
  calendarContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  timeOptionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  timeOption: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#333333",
    gap: 8,
  },
  timeOptionSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  timeOptionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E89A3C",
  },
  timeOptionTextSelected: {
    color: "#000000",
  },
  timeOptionLabel: {
    fontSize: 13,
    color: "#888888",
  },
  timeOptionLabelSelected: {
    color: "#000000",
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
  eTransferInstructions: {
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  eTransferHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  eTransferTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  eTransferStep: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E89A3C",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
  },
  emailBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  emailText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E89A3C",
    flex: 1,
  },
  copiedText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E89A3C",
    marginTop: 6,
    textAlign: "center",
  },
  eTransferWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  eTransferWarningText: {
    fontSize: 13,
    color: "#E89A3C",
    flex: 1,
    lineHeight: 18,
    fontWeight: "600",
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
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
