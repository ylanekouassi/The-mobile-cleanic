import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDecay,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

interface RotatingCarProps {
  size?: number;
}

export default function RotatingCar({ size = 200 }: RotatingCarProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    // Subtle pulsing scale animation
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const startAutoRotation = () => {
    rotation.value = withRepeat(
      withTiming(rotation.value + 360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  };

  // Pan gesture to control rotation with touch
  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isAutoRotating.value) {
        cancelAnimation(rotation);
        isAutoRotating.value = false;
      }
      savedRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.translationX * 0.5;
    })
    .onEnd((event) => {
      rotation.value = withDecay({
        velocity: event.velocityX * 0.5,
        deceleration: 0.998,
      });

      setTimeout(() => {
        if (!isAutoRotating.value) {
          isAutoRotating.value = true;
          startAutoRotation();
        }
      }, 2000);
    });

  const carAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Outer glow */}
        <View style={[styles.outerGlow, { width: size * 1.5, height: size * 1.5 }]} />
        
        {/* Middle glow */}
        <View style={[styles.middleGlow, { width: size * 1.2, height: size * 1.2 }]} />

        <Animated.View style={[styles.carContainer, carAnimatedStyle]}>
          {/* Sports car icon */}
          <View style={styles.carIconWrapper}>
            <Ionicons name="car-sport" size={size * 0.6} color="#E89A3C" />
          </View>
          
          {/* Shine effect overlay */}
          <View style={styles.shineOverlay} />
        </Animated.View>

        {/* Bottom shadow */}
        <View style={[styles.shadow, { width: size * 0.8, top: size * 0.75 }]} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  outerGlow: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#E89A3C",
    opacity: 0.1,
  },
  middleGlow: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#E89A3C",
    opacity: 0.2,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
  },
  carContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  carIconWrapper: {
    backgroundColor: "#1a1a1a",
    borderRadius: 100,
    padding: 30,
    borderWidth: 3,
    borderColor: "#E89A3C",
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  shineOverlay: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    height: 50,
    backgroundColor: "rgba(232, 154, 60, 0.2)",
    borderRadius: 100,
    transform: [{ rotate: "-15deg" }],
  },
  shadow: {
    position: "absolute",
    height: 15,
    backgroundColor: "#E89A3C",
    opacity: 0.15,
    borderRadius: 100,
    transform: [{ scaleY: 0.2 }],
  },
});
