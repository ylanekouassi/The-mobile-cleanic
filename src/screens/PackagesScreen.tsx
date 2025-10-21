import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Package {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: "1",
    name: "Express Shine",
    price: "$89",
    duration: "1-2 hours",
    description: "Perfect for a quick refresh",
    features: [
      "Exterior hand wash",
      "Wheel cleaning",
      "Tire shine",
      "Windows cleaned",
      "Quick interior vacuum",
    ],
  },
  {
    id: "2",
    name: "Premium Detail",
    price: "$199",
    duration: "3-4 hours",
    description: "Our most popular choice",
    popular: true,
    features: [
      "Everything in Express Shine",
      "Clay bar treatment",
      "Machine polish",
      "Premium wax application",
      "Deep interior cleaning",
      "Leather conditioning",
      "Engine bay cleaning",
    ],
  },
  {
    id: "3",
    name: "Ultimate Protection",
    price: "$349",
    duration: "5-6 hours",
    description: "Complete transformation",
    features: [
      "Everything in Premium Detail",
      "Ceramic coating application",
      "Paint correction",
      "Headlight restoration",
      "Pet hair removal",
      "Odor elimination",
      "Fabric protection",
      "6-month warranty",
    ],
  },
];

export default function PackagesScreen() {
  const insets = useSafeAreaInsets();

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
            <Text style={styles.headerTitle}>Our Packages</Text>
            <Text style={styles.headerSubtitle}>
              Choose the perfect service for your vehicle
            </Text>
          </View>

          {/* Packages List */}
          <View style={styles.packagesContainer}>
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </View>

          {/* Additional Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar" size={24} color="#C0C0C0" />
              <Text style={styles.infoText}>
                Flexible scheduling to fit your busy life
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="card" size={24} color="#C0C0C0" />
              <Text style={styles.infoText}>
                Secure payment options available
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="ribbon" size={24} color="#C0C0C0" />
              <Text style={styles.infoText}>
                Satisfaction guaranteed or your money back
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

interface PackageCardProps {
  package: Package;
}

function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <View style={[styles.packageCard, pkg.popular && styles.popularCard]}>
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.packageHeader}>
        <View>
          <Text style={styles.packageName}>{pkg.name}</Text>
          <Text style={styles.packageDescription}>{pkg.description}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{pkg.price}</Text>
        </View>
      </View>

      <View style={styles.durationContainer}>
        <Ionicons name="time-outline" size={16} color="#888888" />
        <Text style={styles.duration}>{pkg.duration}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.featuresContainer}>
        {pkg.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#C0C0C0" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.bookButton, pkg.popular && styles.popularButton]}
      >
        <Text
          style={[
            styles.bookButtonText,
            pkg.popular && styles.popularButtonText,
          ]}
        >
          BOOK NOW
        </Text>
        <Ionicons
          name="arrow-forward"
          size={18}
          color={pkg.popular ? "#000000" : "#C0C0C0"}
        />
      </Pressable>
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
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
  },
  packagesContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingVertical: 10,
  },
  packageCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    position: "relative",
  },
  popularCard: {
    borderColor: "#C0C0C0",
    borderWidth: 2,
    shadowColor: "#C0C0C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    left: 20,
    backgroundColor: "#C0C0C0",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  packageName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    color: "#888888",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 32,
    fontWeight: "700",
    color: "#C0C0C0",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  duration: {
    fontSize: 14,
    color: "#888888",
  },
  divider: {
    height: 1,
    backgroundColor: "#1a1a1a",
    marginVertical: 16,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: "#CCCCCC",
    flex: 1,
  },
  bookButton: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#C0C0C0",
  },
  popularButton: {
    backgroundColor: "#C0C0C0",
    borderColor: "#C0C0C0",
    shadowColor: "#C0C0C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#C0C0C0",
    letterSpacing: 1.5,
  },
  popularButtonText: {
    color: "#000000",
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  infoText: {
    fontSize: 14,
    color: "#CCCCCC",
    flex: 1,
  },
});
