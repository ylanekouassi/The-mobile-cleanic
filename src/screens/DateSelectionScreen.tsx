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
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Available time slots
  const timeSlots = [
    "8:00 AM",
    "10:00 AM",
    "12:00 PM",
    "2:00 PM",
    "4:00 PM",
  ];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Can't book in the past
    if (date < today) return false;
    
    // Can't book on Sundays (0 = Sunday)
    if (date.getDay() === 0) return false;
    
    return true;
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date || !isDateAvailable(date)) return;
    
    const dateString = date.toISOString().split("T")[0];
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

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatMonthYear = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
  };

  const canGoPrevious = () => {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfDisplayedMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    return firstDayOfDisplayedMonth > firstDayOfCurrentMonth;
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

            {/* Month Navigation */}
            <View style={styles.monthNavigation}>
              <Pressable
                onPress={goToPreviousMonth}
                disabled={!canGoPrevious()}
                style={styles.monthButton}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={canGoPrevious() ? "#E89A3C" : "#333333"}
                />
              </Pressable>
              
              <Text style={styles.monthYearText}>{formatMonthYear()}</Text>
              
              <Pressable
                onPress={goToNextMonth}
                style={styles.monthButton}
              >
                <Ionicons name="chevron-forward" size={24} color="#E89A3C" />
              </Pressable>
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarContainer}>
              {/* Day Headers */}
              <View style={styles.dayHeadersRow}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <View key={day} style={styles.dayHeader}>
                    <Text style={styles.dayHeaderText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days */}
              <View style={styles.calendarGrid}>
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <View key={`empty-${index}`} style={styles.calendarDay} />;
                  }

                  const dateString = date.toISOString().split("T")[0];
                  const isSelected = selectedDate === dateString;
                  const isAvailable = isDateAvailable(date);
                  const isSunday = date.getDay() === 0;

                  return (
                    <Pressable
                      key={dateString}
                      style={[
                        styles.calendarDay,
                        isSelected && styles.calendarDaySelected,
                        !isAvailable && styles.calendarDayDisabled,
                        isSunday && styles.calendarDaySunday,
                      ]}
                      onPress={() => handleDateSelect(date)}
                      disabled={!isAvailable}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDayTextSelected,
                          !isAvailable && styles.calendarDayTextDisabled,
                        ]}
                      >
                        {date.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
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
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  monthButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  calendarContainer: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  dayHeadersRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dayHeader: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888888",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  calendarDaySelected: {
    backgroundColor: "#E89A3C",
    borderRadius: 8,
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDaySunday: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  calendarDayTextSelected: {
    color: "#000000",
  },
  calendarDayTextDisabled: {
    color: "#444444",
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
