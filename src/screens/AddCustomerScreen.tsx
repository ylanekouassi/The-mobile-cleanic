import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BACKEND_URL = process.env.EXPO_PUBLIC_VIBECODE_BACKEND_URL || "http://localhost:3000";

export default function AddCustomerScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Customer form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert("Missing Field", "Please enter first name");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Missing Field", "Please enter last name");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Missing Field", "Please enter email");
      return false;
    }
    if (!phone.trim()) {
      Alert.alert("Missing Field", "Please enter phone number");
      return false;
    }
    if (!streetAddress.trim()) {
      Alert.alert("Missing Field", "Please enter street address");
      return false;
    }
    if (!city.trim()) {
      Alert.alert("Missing Field", "Please enter city");
      return false;
    }
    if (!postalCode.trim()) {
      Alert.alert("Missing Field", "Please enter postal code");
      return false;
    }
    return true;
  };

  const handleAddCustomer = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          fullName: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim(),
          phone: phone.trim(),
          streetAddress: streetAddress.trim(),
          city: city.trim(),
          postalCode: postalCode.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setStreetAddress("");
        setCity("");
        setPostalCode("");

        Alert.alert("Success", "Customer added successfully! You can add another or go back.", [
          {
            text: "Add Another",
            style: "default",
          },
          {
            text: "Back to Dashboard",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to add customer");
      }
    } catch (error) {
      console.error("Add customer error:", error);
      Alert.alert("Connection Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="person-add" size={48} color="#E89A3C" />
          <Text style={styles.title}>Add New Customer</Text>
          <Text style={styles.subtitle}>Enter customer information</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor="#666666"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              placeholderTextColor="#666666"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="john.doe@example.com"
              placeholderTextColor="#666666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="(343) 988-0197"
              placeholderTextColor="#666666"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>

            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main Street"
              placeholderTextColor="#666666"
              value={streetAddress}
              onChangeText={setStreetAddress}
            />

            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ottawa"
              placeholderTextColor="#666666"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Postal Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="K1A 0B1"
              placeholderTextColor="#666666"
              value={postalCode}
              onChangeText={setPostalCode}
              autoCapitalize="characters"
              maxLength={7}
            />
          </View>

          <Pressable
            style={[styles.addButton, loading && styles.addButtonDisabled]}
            onPress={handleAddCustomer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#000000" />
                <Text style={styles.addButtonText}>ADD CUSTOMER</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    marginTop: 5,
  },
  form: {
    gap: 20,
  },
  section: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E89A3C",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CCCCCC",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
