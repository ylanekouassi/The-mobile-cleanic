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
      value: "+1 (343) 988-0197",
      action: () => Linking.openURL("tel:+13439880197"),
    },
    {
      id: "2",
      icon: "mail",
      title: "Email Us",
      value: "themobilecleanic@gmail.com",
      action: () => Linking.openURL("mailto:themobilecleanic@gmail.com"),
    },
    {
      id: "3",
      icon: "chatbubbles",
      title: "Text Us",
      value: "+1 (343) 988-0197",
      action: () => Linking.openURL("sms:+13439880197"),
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

          {/* Call to Action */}
          <View style={styles.ctaContainer}>
            <View style={styles.ctaBox}>
              <Ionicons name="calendar" size={48} color="#E89A3C" />
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
        <Ionicons name={method.icon} size={28} color="#E89A3C" />
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
    borderColor: "#E89A3C",
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
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  ctaBox: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: "#E89A3C",
    alignItems: "center",
    shadowColor: "#E89A3C",
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
    backgroundColor: "#E89A3C",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    shadowColor: "#E89A3C",
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
