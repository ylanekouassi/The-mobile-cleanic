import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import PackagesScreen from "../screens/PackagesScreen";
import ContactScreen from "../screens/ContactScreen";
import BookingScreen from "../screens/BookingScreen";
import CustomDrawer from "../components/CustomDrawer";
import LanguageSwitcher from "../components/LanguageSwitcher";

export type RootDrawerParamList = {
  Home: undefined;
  Packages: undefined;
  Contact: undefined;
  Booking: {
    packageName: string;
    packagePrice: string;
    vehicleType: string;
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
        options={{
          title: "Packages",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: "Contact",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="call" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          title: "Booking",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
}
