import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function CustomDrawer(props: DrawerContentComponentProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#000000", "#0a0a0a", "#1a1a1a"]}
        style={styles.gradient}
      >
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="car-sport" size={48} color="#D4AF37" />
            </View>
            <Text style={styles.title}>The Mobile</Text>
            <Text style={styles.subtitle}>CLEANIC</Text>
            <View style={styles.divider} />
          </View>

          {/* Navigation Items */}
          <View style={styles.navContainer}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={24} color="#888888" />
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#888888" />
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={24} color="#888888" />
            </Pressable>
          </View>
          <Text style={styles.footerText}>Premium Car Detailing</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#D4AF37",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#D4AF37",
    letterSpacing: 4,
    marginTop: -5,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "#D4AF37",
    marginTop: 15,
    borderRadius: 1,
  },
  navContainer: {
    flex: 1,
    paddingTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "#333333",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    marginBottom: 15,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  footerText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    letterSpacing: 1,
  },
});
