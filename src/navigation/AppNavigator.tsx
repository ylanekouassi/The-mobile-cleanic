import React from "react";
import { Pressable } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import PackagesScreen from "../screens/PackagesScreen";
import ContactScreen from "../screens/ContactScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import DateSelectionScreen from "../screens/DateSelectionScreen";
import BookingScreen from "../screens/BookingScreen";
import CustomDrawer from "../components/CustomDrawer";
import LanguageSwitcher from "../components/LanguageSwitcher";
import CartIcon from "../components/CartIcon";

export type RootDrawerParamList = {
  Home: undefined;
  Packages: undefined;
  Contact: undefined;
  Cart: undefined;
  Checkout: undefined;
  DateSelection: {
    packageName: string;
    packagePrice: string;
    vehicleType: string;
  };
  Booking: {
    packageName: string;
    packagePrice: string;
    vehicleType: string;
    selectedDate: string;
    selectedTime: string;
  };
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000000",
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#E89A3C",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 20,
        },
        drawerStyle: {
          backgroundColor: "#0a0a0a",
          width: 280,
        },
        drawerActiveBackgroundColor: "#1a1a1a",
        drawerActiveTintColor: "#E89A3C",
        drawerInactiveTintColor: "#888888",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginLeft: 5,
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          paddingVertical: 5,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "The Mobile Cleanic",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => <LanguageSwitcher />,
        }}
      />
      <Drawer.Screen
        name="Packages"
        component={PackagesScreen}
        options={({ navigation }) => ({
          title: "Packages",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E89A3C" />
            </Pressable>
          ),
          headerRight: () => <CartIcon />,
        })}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={({ navigation }) => ({
          title: "Contact",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="call" size={size} color={color} />
          ),
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E89A3C" />
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={({ navigation }) => ({
          title: "Cart",
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E89A3C" />
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={({ navigation }) => ({
          title: "Checkout",
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E89A3C" />
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="DateSelection"
        component={DateSelectionScreen}
        options={({ navigation }) => ({
          title: "Select Date",
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E89A3C" />
            </Pressable>
          ),
        })}
      />
      <Drawer.Screen
        name="Booking"
        component={BookingScreen}
        options={({ navigation }) => ({
          title: "Booking",
          drawerItemStyle: { display: "none" },
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#E89A3C" />
            </Pressable>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}
