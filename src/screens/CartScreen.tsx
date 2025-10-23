import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamList } from "../navigation/AppNavigator";
import { useCartStore } from "../state/cartStore";

type CartScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, "Cart">;

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CartScreenNavigationProp>();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart first.");
      return;
    }

    Alert.alert(
      "Checkout",
      "Proceed to select date and time for your services?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            navigation.navigate("Checkout");
          },
        },
      ]
    );
  };

  const handleRemoveItem = (id: string, itemName: string) => {
    Alert.alert(
      "Remove Item",
      `Remove ${itemName} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeItem(id),
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Remove all items from cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => clearCart(),
        },
      ]
    );
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <Text style={styles.headerSubtitle}>
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </Text>
          </View>

          {/* Cart Items */}
          {items.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={80} color="#333333" />
              <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
              <Text style={styles.emptyCartText}>
                Add some packages to get started
              </Text>
              <Pressable
                style={styles.shopButton}
                onPress={() => navigation.navigate("Packages")}
              >
                <Ionicons name="add-circle" size={20} color="#000000" />
                <Text style={styles.shopButtonText}>BROWSE PACKAGES</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.itemsContainer}>
                {items.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.packageName}</Text>
                        <View style={styles.vehicleBadge}>
                          <Ionicons
                            name={
                              item.vehicleType === "sedan"
                                ? "car-outline"
                                : item.vehicleType === "suv"
                                ? "subway-outline"
                                : "bus-outline"
                            }
                            size={16}
                            color="#E89A3C"
                          />
                          <Text style={styles.vehicleText}>
                            {item.vehicleType.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => handleRemoveItem(item.id, item.packageName)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                      </Pressable>
                    </View>

                    <View style={styles.itemDetails}>
                      <View style={styles.quantityControls}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Ionicons name="remove" size={20} color="#E89A3C" />
                        </Pressable>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Ionicons name="add" size={20} color="#E89A3C" />
                        </Pressable>
                      </View>

                      <Text style={styles.itemPrice}>
                        ${item.finalPrice * item.quantity}
                      </Text>
                    </View>

                    <View style={styles.itemPriceBreakdown}>
                      <Text style={styles.priceBreakdownText}>
                        ${item.finalPrice} × {item.quantity}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Clear Cart Button */}
              <Pressable style={styles.clearButton} onPress={handleClearCart}>
                <Ionicons name="trash-outline" size={18} color="#ff4444" />
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </Pressable>

              {/* Summary */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Ionicons name="receipt-outline" size={24} color="#E89A3C" />
                  <Text style={styles.summaryTitle}>Order Summary</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Service Total:</Text>
                  <Text style={styles.summaryValue}>${getTotalPrice()}</Text>
                </View>

                <View style={styles.reservationNotice}>
                  <Ionicons name="information-circle" size={20} color="#E89A3C" />
                  <Text style={styles.reservationText}>
                    $30 reservation fee required to book
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Due Today:</Text>
                  <Text style={styles.summaryTotalValue}>$30</Text>
                </View>

                <Text style={styles.remainingText}>
                  Remaining ${getTotalPrice() - 30} due after service
                </Text>
              </View>

              {/* Checkout Button */}
              <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
                <Ionicons name="calendar-outline" size={20} color="#000000" />
                <Text style={styles.checkoutButtonText}>SCHEDULE APPOINTMENT</Text>
              </Pressable>
            </>
          )}
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
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888888",
  },
  emptyCart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 30,
  },
  shopButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  shopButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
  itemsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  vehicleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  vehicleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E89A3C",
  },
  removeButton: {
    padding: 8,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E89A3C",
    minWidth: 30,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#E89A3C",
  },
  itemPriceBreakdown: {
    alignItems: "flex-end",
  },
  priceBreakdownText: {
    fontSize: 12,
    color: "#666666",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff4444",
  },
  summaryCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E89A3C",
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#888888",
  },
  summaryValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#1a1a1a",
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryTotalValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E89A3C",
  },
  reservationNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E89A3C",
  },
  reservationText: {
    fontSize: 13,
    color: "#E89A3C",
    fontWeight: "600",
    flex: 1,
  },
  remainingText: {
    fontSize: 13,
    color: "#888888",
    textAlign: "center",
    marginTop: 8,
  },
  checkoutButton: {
    flexDirection: "row",
    backgroundColor: "#E89A3C",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 1,
  },
});
