import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from "react-native";
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
  category: "interior" | "exterior" | "in-n-out";
}

const PACKAGES: Package[] = [
  // INTERIOR PACKAGES
  {
    id: "1",
    name: "Interior Basic",
    price: "$99",
    duration: "1-2 hours",
    description: "Essential interior cleaning",
    category: "interior",
    features: [
      "Complete vacuum",
      "Dashboard & console cleaning",
      "Door panel cleaning",
      "Windows cleaned inside",
      "Floor mat cleaning",
    ],
  },
  {
    id: "2",
    name: "Interior Premium",
    price: "$189",
    duration: "2-4 hours",
    description: "Deep interior detailing",
    popular: true,
    category: "interior",
    features: [
      "Everything in Interior Basic",
      "Carpet shampooing",
      "Leather conditioning (if applicable)",
      "Pet hair removal (if applicable)",
    ],
  },

  // EXTERIOR PACKAGES
  {
    id: "4",
    name: "Exterior Wash",
    price: "$69",
    duration: "1 hour",
    description: "Quick exterior refresh",
    category: "exterior",
    features: [
      "Hand wash & dry",
      "Wheel cleaning",
      "Tire shine",
      "Windows cleaned outside",
      "Door jambs wiped",
    ],
  },
  {
    id: "5",
    name: "Exterior Detail",
    price: "$159",
    duration: "2-3 hours",
    description: "Professional exterior care",
    popular: true,
    category: "exterior",
    features: [
      "Everything in Exterior Wash",
      "Clay bar treatment",
      "Machine polish",
      "Premium wax application",
      "Trim restoration",
      "Headlight polish",
    ],
  },
  {
    id: "6",
    name: "Exterior Protection",
    price: "$299",
    duration: "4-5 hours",
    description: "Maximum paint protection",
    category: "exterior",
    features: [
      "Everything in Exterior Detail",
      "Paint correction",
      "Ceramic coating application",
      "Wheel coating",
      "Glass coating",
      "6-month warranty",
    ],
  },

  // IN-N-OUT PACKAGES (Complete)
  {
    id: "9",
    name: "Full Detail",
    price: "$299",
    duration: "6-8 hours",
    description: "Total transformation",
    popular: true,
    category: "in-n-out",
    features: [
      "Everything in Premium Complete",
      "Paint correction",
      "Ceramic coating",
      "Headlight restoration",
      "Engine bay detailing",
      "Odor elimination",
      "Fabric & paint protection",
      "12-month warranty",
    ],
  },
];

type CategoryType = "interior" | "exterior" | "in-n-out";

type VehicleType = "sedan" | "suv" | "van";

export default function PackagesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("interior");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const filteredPackages = PACKAGES.filter(pkg => pkg.category === selectedCategory);

  const handleBookNow = (pkg: Package) => {
    setSelectedPackage(pkg);
    setModalVisible(true);
  };

  const handleVehicleSelect = (vehicleType: VehicleType) => {
    setModalVisible(false);
    // TODO: Navigate to booking confirmation or next step
    console.log(`Selected ${vehicleType} for ${selectedPackage?.name}`);
  };

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

          {/* Category Tabs */}
          <View style={styles.categoryContainer}>
            <Pressable
              style={[
                styles.categoryTab,
                selectedCategory === "interior" && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory("interior")}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={selectedCategory === "interior" ? "#000000" : "#E89A3C"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === "interior" && styles.categoryTextActive,
                ]}
              >
                Interior
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryTab,
                selectedCategory === "exterior" && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory("exterior")}
            >
              <Ionicons
                name="water-outline"
                size={20}
                color={selectedCategory === "exterior" ? "#000000" : "#E89A3C"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === "exterior" && styles.categoryTextActive,
                ]}
              >
                Exterior
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.categoryTab,
                selectedCategory === "in-n-out" && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory("in-n-out")}
            >
              <Ionicons
                name="car-sport-outline"
                size={20}
                color={selectedCategory === "in-n-out" ? "#000000" : "#E89A3C"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === "in-n-out" && styles.categoryTextActive,
                ]}
              >
                In-N-Out
              </Text>
            </Pressable>
          </View>

          {/* Packages List */}
          <View style={styles.packagesContainer}>
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} onBookNow={handleBookNow} />
            ))}
          </View>

          {/* Additional Info */}
          <View style={styles.infoSection}>
            <View style={styles.priceNotice}>
              <Ionicons name="information-circle" size={24} color="#E89A3C" />
              <Text style={styles.priceNoticeText}>
                Prices may vary depending on vehicle size, distance and condition
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Vehicle Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Vehicle Type</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={32} color="#E89A3C" />
                </Pressable>
              </View>

              <Text style={styles.modalSubtitle}>
                Choose your vehicle type for {selectedPackage?.name}
              </Text>

              <View style={styles.vehicleOptionsContainer}>
                <Pressable
                  style={styles.vehicleOption}
                  onPress={() => handleVehicleSelect("sedan")}
                >
                  <Ionicons name="car-outline" size={48} color="#E89A3C" />
                  <Text style={styles.vehicleTypeText}>Sedan</Text>
                  <Text style={styles.vehicleDescription}>
                    Standard cars, coupes
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.vehicleOption}
                  onPress={() => handleVehicleSelect("suv")}
                >
                  <Ionicons name="subway-outline" size={48} color="#E89A3C" />
                  <Text style={styles.vehicleTypeText}>SUV</Text>
                  <Text style={styles.vehicleDescription}>
                    SUVs, crossovers, trucks
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.vehicleOption}
                  onPress={() => handleVehicleSelect("van")}
                >
                  <Ionicons name="bus-outline" size={48} color="#E89A3C" />
                  <Text style={styles.vehicleTypeText}>Van</Text>
                  <Text style={styles.vehicleDescription}>
                    Minivans, large vehicles
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

interface PackageCardProps {
  package: Package;
  onBookNow: (pkg: Package) => void;
}

function PackageCard({ package: pkg, onBookNow }: PackageCardProps) {
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
            <Ionicons name="checkmark-circle" size={20} color="#E89A3C" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.bookButton, pkg.popular && styles.popularButton]}
        onPress={() => onBookNow(pkg)}
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
          color={pkg.popular ? "#000000" : "#E89A3C"}
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
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  categoryTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#0f0f0f",
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  categoryTabActive: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E89A3C",
  },
  categoryTextActive: {
    color: "#000000",
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
    borderColor: "#E89A3C",
    borderWidth: 2,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    left: 20,
    backgroundColor: "#E89A3C",
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
    color: "#E89A3C",
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
    borderColor: "#E89A3C",
  },
  popularButton: {
    backgroundColor: "#E89A3C",
    borderColor: "#E89A3C",
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E89A3C",
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
  priceNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  priceNoticeText: {
    fontSize: 14,
    color: "#E89A3C",
    flex: 1,
    fontWeight: "600",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#E89A3C",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#888888",
    marginBottom: 24,
    textAlign: "center",
  },
  vehicleOptionsContainer: {
    gap: 16,
  },
  vehicleOption: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  vehicleTypeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E89A3C",
    marginTop: 12,
    marginBottom: 4,
  },
  vehicleDescription: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
  },
});
