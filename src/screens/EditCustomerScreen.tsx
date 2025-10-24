import React, { useState, useEffect } from "react";
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

const BACKEND_URL = process.env.EXPO_PUBLIC_VIBECODE_BACKEND_URL || "http://localhost:3000";

type RouteParams = {
  EditCustomer: {
    customerId: string;
  };
};

export default function EditCustomerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'EditCustomer'>>();
  const customerId = route.params?.customerId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Customer form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/customers/${customerId}`);
      const data = await response.json();

      if (data.success) {
        const customer = data.customer;
        setFirstName(customer.firstName);
        setLastName(customer.lastName);
        setEmail(customer.email);
        setPhone(customer.phone);
        setStreetAddress(customer.streetAddress);
        setCity(customer.city);
        setPostalCode(customer.postalCode);
      }
    } catch (error) {
      console.error("Fetch customer error:", error);
      Alert.alert("Error", "Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateCustomer = async () => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/customers/${customerId}`, {
        method: "PUT",
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
        Alert.alert("Success", "Customer updated successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Error", data.error || "Failed to update customer");
      }
    } catch (error) {
      console.error("Update customer error:", error);
      Alert.alert("Connection Error", "Could not connect to server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E89A3C" />
          <Text style={styles.loadingText}>Loading customer...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#000000", "#0a0a0a", "#1a1a1a"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="person" size={48} color="#E89A3C" />
          <Text style={styles.title}>Edit Customer</Text>
          <Text style={styles.subtitle}>Update customer information</Text>
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
            style={[styles.updateButton, saving && styles.updateButtonDisabled]}
            onPress={handleUpdateCustomer}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#000000" />
                <Text style={styles.updateButtonText}>UPDATE CUSTOMER</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#888888",
    marginTop: 15,
    fontSize: 14,
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
  updateButton: {
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
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
