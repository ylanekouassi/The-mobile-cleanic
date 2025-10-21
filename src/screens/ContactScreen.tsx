import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ContactMethod {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  action: () => void;
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  const contactMethods: ContactMethod[] = [
    {
      id: "1",
      icon: "call",
      title: "Call Us",
      value: "+1 (555) 123-4567",
      action: () => Linking.openURL("tel:+15551234567"),
    },
    {
      id: "2",
      icon: "mail",
      title: "Email Us",
      value: "info@mobilecleanic.com",
      action: () => Linking.openURL("mailto:info@mobilecleanic.com"),
    },
    {
      id: "3",
      icon: "chatbubbles",
      title: "Text Us",
      value: "+1 (555) 123-4567",
      action: () => Linking.openURL("sms:+15551234567"),
    },
    {
      id: "4",
      icon: "location",
      title: "Service Area",
      value: "Los Angeles & Surrounding Areas",
      action: () => {},
    },
  ];

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
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="car-sport" size={56} color="#D4AF37" />
            </View>
            <Text style={styles.headerTitle}>Get in Touch</Text>
            <Text style={styles.headerSubtitle}>
              We would love to hear from you. Reach out to schedule your
              appointment or ask any questions.
            </Text>
          </View>

          {/* Contact Methods */}
          <View style={styles.contactMethodsContainer}>
            {contactMethods.map((method) => (
              <ContactMethodCard key={method.id} method={method} />
            ))}
          </View>

          {/* Hours Section */}
          <View style={styles.hoursSection}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.hoursCard}>
              <HourRow day="Monday - Friday" hours="8:00 AM - 6:00 PM" />
              <View style={styles.hoursDivider} />
              <HourRow day="Saturday" hours="9:00 AM - 5:00 PM" />
              <View style={styles.hoursDivider} />
              <HourRow day="Sunday" hours="Closed" />
            </View>
          </View>

          {/* Social Media */}
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Follow Us</Text>
            <View style={styles.socialButtons}>
              <Pressable style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={28} color="#D4AF37" />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={28} color="#D4AF37" />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Ionicons name="logo-twitter" size={28} color="#D4AF37" />
              </Pressable>
              <Pressable style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={28} color="#D4AF37" />
              </Pressable>
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaContainer}>
            <View style={styles.ctaBox}>
              <Ionicons name="calendar" size={48} color="#D4AF37" />
              <Text style={styles.ctaTitle}>Ready to Book?</Text>
              <Text style={styles.ctaText}>
                Schedule your appointment today and experience the difference
              </Text>
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>SCHEDULE NOW</Text>
                <Ionicons name="arrow-forward" size={20} color="#000000" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

interface ContactMethodCardProps {
  method: ContactMethod;
}

function ContactMethodCard({ method }: ContactMethodCardProps) {
  return (
    <Pressable
      style={styles.contactCard}
      onPress={method.action}
      disabled={method.id === "4"}
    >
      <View style={styles.contactIconContainer}>
        <Ionicons name={method.icon} size={28} color="#D4AF37" />
      </View>
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactTitle}>{method.title}</Text>
        <Text style={styles.contactValue}>{method.value}</Text>
      </View>
      {method.id !== "4" && (
        <Ionicons name="chevron-forward" size={24} color="#666666" />
      )}
    </Pressable>
  );
}

interface HourRowProps {
  day: string;
  hours: string;
}

function HourRow({ day, hours }: HourRowProps) {
  return (
    <View style={styles.hourRow}>
      <Text style={styles.dayText}>{day}</Text>
      <Text style={styles.hoursText}>{hours}</Text>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  contactMethodsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    gap: 14,
  },
  contactIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: "#888888",
  },
  hoursSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  hoursCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hoursDivider: {
    height: 1,
    backgroundColor: "#1a1a1a",
    marginVertical: 14,
  },
  dayText: {
    fontSize: 15,
    color: "#CCCCCC",
    fontWeight: "500",
  },
  hoursText: {
    fontSize: 15,
    color: "#888888",
  },
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0f0f0f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D4AF37",
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  ctaBox: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  ctaText: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: "row",
    backgroundColor: "#D4AF37",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1.5,
  },
});
