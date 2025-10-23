import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function PolicyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000000", "#0a0a0a", "#000000"]} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="shield-checkmark" size={60} color="#E89A3C" />
            <Text style={styles.headerTitle}>Our Policies</Text>
            <Text style={styles.headerSubtitle}>
              Terms, conditions, and guidelines for our services
            </Text>
          </View>

          {/* Cancellation Policy */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="close-circle-outline" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Cancellation Policy</Text>
            </View>
            <Text style={styles.paragraph}>
              Cancellations made 24 hours or more before the scheduled appointment will receive a full refund of the $30 reservation fee.
            </Text>
            <Text style={styles.paragraph}>
              Cancellations made less than 24 hours before the appointment will forfeit the $30 reservation fee.
            </Text>
          </View>

          {/* Payment Policy */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card-outline" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Payment Policy</Text>
            </View>
            <Text style={styles.paragraph}>
              A $30 reservation fee is required to book your appointment. This can be paid via credit card or e-Transfer.
            </Text>
            <Text style={styles.paragraph}>
              The remaining balance is due upon completion of the service. We accept cash, credit card, and e-Transfer.
            </Text>
          </View>

          {/* Service Policy */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-done-outline" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Service Policy</Text>
            </View>
            <Text style={styles.paragraph}>
              All services are performed at your location. Please ensure access to water and electricity.
            </Text>
            <Text style={styles.paragraph}>
              Service times are estimates and may vary based on vehicle condition.
            </Text>
            <Text style={styles.paragraph}>
              We reserve the right to adjust pricing if the vehicle condition significantly differs from standard expectations.
            </Text>
          </View>

          {/* Liability */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alert-circle-outline" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Liability</Text>
            </View>
            <Text style={styles.paragraph}>
              The Mobile Cleanic is fully insured. We take great care with every vehicle.
            </Text>
            <Text style={styles.paragraph}>
              Please report any pre-existing damage before service begins. We are not responsible for pre-existing damage.
            </Text>
          </View>

          {/* Weather Policy */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="rainy-outline" size={24} color="#E89A3C" />
              <Text style={styles.sectionTitle}>Weather Policy</Text>
            </View>
            <Text style={styles.paragraph}>
              In case of severe weather, we may need to reschedule your appointment. You will be notified as soon as possible and your reservation fee will be transferred to the new date.
            </Text>
          </View>

          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Ionicons name="mail" size={24} color="#E89A3C" />
            <Text style={styles.contactText}>
              Questions about our policies? Contact us at themobilecleanic@gmail.com
            </Text>
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
    alignItems: "center",
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  paragraph: {
    fontSize: 15,
    color: "#CCCCCC",
    lineHeight: 24,
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#0f0f0f",
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E89A3C",
    marginTop: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#E89A3C",
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
  },
});
