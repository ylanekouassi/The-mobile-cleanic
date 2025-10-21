import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import RotatingCar from "../components/RotatingCar";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 1000 });
    slideAnim.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

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
          {/* Hero Section with Car */}
          <Animated.View style={[styles.heroSection, animatedStyle]}>
            <View style={styles.cubeContainer}>
              <RotatingCar size={300} />
            </View>
          </Animated.View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <Feature
              icon="shield-checkmark"
              title="Professional"
              description="Expert technicians with years of experience"
            />
            <Feature
              icon="location"
              title="Mobile Service"
              description="We come to your home or office"
            />
          </View>

          {/* Call to Action */}
          <View style={styles.ctaContainer}>
            <View style={styles.ctaBox}>
              <Text style={styles.ctaText}>
                Browse our packages and book your appointment today
              </Text>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>VIEW PACKAGES</Text>
                <Ionicons name="arrow-forward" size={20} color="#000000" />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

interface FeatureProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon} size={32} color="#E89A3C" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
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
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  cubeContainer: {
    marginVertical: 30,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  featureCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  featureDescription: {
    fontSize: 14,
    color: "#888888",
    lineHeight: 20,
  },
  ctaContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
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
