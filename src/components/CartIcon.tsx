import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../state/cartStore";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../navigation/AppNavigator";

type CartIconNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

export default function CartIcon() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const navigation = useNavigation<CartIconNavigationProp>();

  const handlePress = () => {
    navigation.navigate("Cart");
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Ionicons name="cart-outline" size={28} color="#E89A3C" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#E89A3C",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  badgeText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
  },
});
