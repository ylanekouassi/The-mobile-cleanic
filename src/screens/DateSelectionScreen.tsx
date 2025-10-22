import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../navigation/AppNavigator";

type DateSelectionScreenRouteProp = RouteProp<RootDrawerParamList, "DateSelection">;
type DateSelectionScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, "DateSelection">;

export default function DateSelectionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DateSelectionScreenNavigationProp>();
  const route = useRoute<DateSelectionScreenRouteProp>();
  
  const { packageName, packagePrice, vehicleType } = route.params || {};

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate available dates (next 14 days, excluding Sundays)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (0 = Sunday)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Available time slots
  const timeSlots = [
    "8:00 AM",
    "10:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
  ];

  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return {
      dayName: days[date.getDay()],
      dayNumber: date.getDate(),
      month: months[date.getMonth()],
      year: date.getFullYear(),
      fullDate: date.toISOString().split("T")[0],
    };
  };

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigation.navigate("Booking", {
        packageName,
        packagePrice,
        vehicleType,
        selectedDate,
        selectedTime,
      });
    }
  };

  const isFormValid = selectedDate !== null && selectedTime !== null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#000000"]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Date & Time</Text>
            <Text style={styles.headerSubtitle}>
              Choose your preferred appointment slot
            </Text>
          </View>

          {/* Package Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Package:</Text>
              <Text style={styles.summaryValue}>{packageName || "N/A"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Vehicle:</Text>
              <Text style={styles.summaryValue}>
                {vehicleType ? vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1) : "N/A"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryPrice}>{packagePrice || "$0"}</Text>
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Select a Date</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {availableDates.map((date) => {
                const formatted = formatDate(date);
                const isSelected = selectedDate === formatted.fullDate;
                
                return (
                  <Pressable
                    key={formatted.fullDate}
                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                    onPress={() => handleDateSelect(formatted.fullDate)}
                  >
                    <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                      {formatted.dayName}
                    </Text>
                    <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                      {formatted.dayNumber}
                    </Text>
                    <Text style={[styles.monthName, isSelected && styles.monthNameSelected]}>
                      {formatted.month}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Time Selection */}
          {selectedDate && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={24} color="#E89A3C" />
                <Text style={styles.sectionTitle}>Select a Time</Text>
              </View>

              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  
                  return (
                    <Pressable
                      key={time}
                      style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <Ionicons
                        name="time"
                        size={20}
                        color={isSelected ? "#000000" : "#E89A3C"}
                      />
                      <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={!isFormValid}
            >
              <Text style={styles.continueButtonText}>CONTINUE TO BOOKING</Text>
              <Ionicons name="arrow-forward" size={20} color="#000000" />
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Go Back</Text>
            </Pressable>
          </View>
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
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E89A3C",
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#888888",
  },
  summaryValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  summaryPrice: {
    fontSize: 18,
    color: "#E89A3C",
    fontWeight: "700",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  datesContainer: {
    gap: 12,
    paddingVertical: 4,
  },
  dateCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    minWidth: 80,
  },
  dateCardSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  dayName: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
    marginBottom: 4,
  },
  dayNameSelected: {
    color: "#000000",
  },
  dayNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  dayNumberSelected: {
    color: "#000000",
  },
  monthName: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
  },
  monthNameSelected: {
    color: "#000000",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    flexDirection: "row",
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#1a1a1a",
    minWidth: "47%",
  },
  timeSlotSelected: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  timeTextSelected: {
    color: "#000000",
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  continueButtonDisabled: {
    backgroundColor: "#333333",
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#888888",
    fontWeight: "600",
  },
});
