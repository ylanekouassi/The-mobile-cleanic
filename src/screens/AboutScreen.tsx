import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Stat {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

interface Value {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const STATS: Stat[] = [
  { id: "1", icon: "people", value: "10K+", label: "Happy Customers" },
  { id: "2", icon: "car", value: "25K+", label: "Cars Detailed" },
  { id: "3", icon: "trophy", value: "15+", label: "Years Experience" },
  { id: "4", icon: "star", value: "4.9", label: "Average Rating" },
];

const VALUES: Value[] = [
  {
    id: "1",
    icon: "shield-checkmark",
    title: "Quality First",
    description: "We never compromise on the quality of our work or products",
  },
  {
    id: "2",
    icon: "time",
    title: "Punctual Service",
    description: "We respect your time and always arrive when scheduled",
  },
  {
    id: "3",
    icon: "heart",
    title: "Customer Focused",
    description: "Your satisfaction is our top priority, guaranteed",
  },
];

export default function AboutScreen() {
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
          {/* Story Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All About Me</Text>
            <View style={styles.storyCard}>
              <Text style={styles.storyText}>
                I am a young entrepreneur driven by a passion for perfection and precision. 
                My journey began working with premier dealerships including Nissan and Mazda, 
                where I honed my craft and developed an eye for detail.
              </Text>
              <Text style={[styles.storyText, styles.storyTextSpacing]}>
                To elevate my expertise, I pursued a professional car detailing certification 
                at a mechanic school in Montreal. But I did not stop there—I taught myself 
                to code, building apps and websites from the ground up.
              </Text>
              <Text style={[styles.storyText, styles.storyTextSpacing]}>
                This app is the result of that journey: built entirely from scratch, combining 
                my passion for detailing with my self-taught tech skills. My mission is to 
                inspire and motivate young entrepreneurs like me to chase their dreams and 
                build something extraordinary.
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>By the Numbers</Text>
            <View style={styles.statsGrid}>
              {STATS.map((stat) => (
                <View key={stat.id} style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name={stat.icon} size={28} color="#E89A3C" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Values Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Values</Text>
            <View style={styles.valuesContainer}>
              {VALUES.map((value) => (
                <View key={value.id} style={styles.valueCard}>
                  <View style={styles.valueIconContainer}>
                    <Ionicons name={value.icon} size={32} color="#E89A3C" />
                  </View>
                  <View style={styles.valueTextContainer}>
                    <Text style={styles.valueTitle}>{value.title}</Text>
                    <Text style={styles.valueDescription}>
                      {value.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Team Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Team</Text>
            <View style={styles.teamCard}>
              <Ionicons name="people-circle" size={64} color="#E89A3C" />
              <Text style={styles.teamTitle}>Certified Professionals</Text>
              <Text style={styles.teamText}>
                Our team consists of highly trained and certified detailing
                professionals who are passionate about cars. Each member undergoes
                rigorous training and continuous education to stay updated with
                the latest techniques and products in the industry.
              </Text>
            </View>
          </View>

          {/* Promise Section */}
          <View style={styles.promiseSection}>
            <View style={styles.promiseCard}>
              <Ionicons name="ribbon" size={48} color="#E89A3C" />
              <Text style={styles.promiseTitle}>Our Promise</Text>
              <Text style={styles.promiseText}>
                We guarantee complete satisfaction with every service. If you are
                not 100% happy with the results, we will make it right or refund
                your money. No questions asked.
              </Text>
            </View>
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
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  storyCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  storyText: {
    fontSize: 15,
    color: "#CCCCCC",
    lineHeight: 24,
  },
  storyTextSpacing: {
    marginTop: 16,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  statIconContainer: {
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
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#E89A3C",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888888",
    textAlign: "center",
  },
  valuesContainer: {
    gap: 16,
  },
  valueCard: {
    flexDirection: "row",
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    gap: 16,
  },
  valueIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  valueTextContainer: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  valueDescription: {
    fontSize: 14,
    color: "#888888",
    lineHeight: 20,
  },
  teamCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  teamTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 12,
  },
  teamText: {
    fontSize: 15,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
  },
  promiseSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  promiseCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E89A3C",
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  promiseTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  promiseText: {
    fontSize: 15,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
  },
});
