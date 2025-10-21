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
  interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

interface RotatingCarProps {
  size?: number;
}

export default function RotatingCar({ size = 240 }: RotatingCarProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    // Subtle pulsing scale animation
    scale.value = withRepeat(
      withTiming(1.03, {
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
        duration: 10000,
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

  // Animate different parts based on rotation
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [1, 0.8, 0.6, 0.8, 1]
    );
    return { opacity };
  });

  const sideAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0.6, 1, 0.8, 0.6, 0.6]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, 20, 0, -20, 0]
    );
    return { opacity, transform: [{ translateX }] };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0.5, 0.7, 1, 0.7, 0.5]
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Outer glow */}
        <View style={[styles.outerGlow, { width: size * 1.4, height: size * 1.4 }]} />
        
        {/* Middle glow */}
        <View style={[styles.middleGlow, { width: size * 1.15, height: size * 1.15 }]} />

        <Animated.View style={[styles.carContainer, carAnimatedStyle]}>
          {/* Back layer - darker */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.car3D}>
              {/* Car Body Back */}
              <View style={[styles.carBody, styles.carBodyBack]}>
                <LinearGradient
                  colors={["#1a1a1a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </View>
              {/* Roof Back */}
              <View style={[styles.carRoof, styles.carRoofBack]} />
            </View>
          </Animated.View>

          {/* Side layer */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.car3D}>
              {/* Car Body Side */}
              <View style={[styles.carBody, styles.carBodySide]}>
                <LinearGradient
                  colors={["#E89A3C", "#C67B2E", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Window */}
                <View style={styles.window} />
              </View>
              {/* Roof Side */}
              <View style={[styles.carRoof, styles.carRoofSide]}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              {/* Wheels */}
              <View style={[styles.wheel, styles.wheelFront]} />
              <View style={[styles.wheel, styles.wheelBack]} />
            </View>
          </Animated.View>

          {/* Front layer - brightest */}
          <Animated.View style={[styles.carLayer, bodyAnimatedStyle]}>
            <View style={styles.car3D}>
              {/* Car Body Front */}
              <View style={[styles.carBody, styles.carBodyFront]}>
                <LinearGradient
                  colors={["#FFB347", "#E89A3C", "#FFB347"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Headlight effect */}
                <View style={styles.headlight} />
              </View>
              {/* Roof Front */}
              <View style={[styles.carRoof, styles.carRoofFront]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Bottom shadow */}
        <View style={[styles.shadow, { width: size * 0.7, top: size * 0.72 }]} />
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
    opacity: 0.08,
  },
  middleGlow: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#E89A3C",
    opacity: 0.15,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
  },
  carContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  carLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  car3D: {
    width: 160,
    height: 90,
    position: "relative",
  },
  carBody: {
    position: "absolute",
    bottom: 0,
    width: 160,
    height: 50,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  carBodyFront: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  carBodySide: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  carBodyBack: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  carRoof: {
    position: "absolute",
    top: 20,
    left: 40,
    width: 80,
    height: 30,
    borderRadius: 6,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  carRoofFront: {
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  carRoofSide: {
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  carRoofBack: {
    backgroundColor: "#1a1a1a",
    borderWidth: 0.5,
    borderColor: "rgba(100, 100, 100, 0.2)",
  },
  window: {
    position: "absolute",
    top: -15,
    left: 45,
    width: 70,
    height: 15,
    backgroundColor: "rgba(100, 150, 200, 0.3)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(150, 200, 255, 0.2)",
  },
  headlight: {
    position: "absolute",
    left: 10,
    top: 15,
    width: 12,
    height: 12,
    backgroundColor: "rgba(255, 255, 200, 0.8)",
    borderRadius: 6,
    shadowColor: "#FFE066",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  wheel: {
    position: "absolute",
    bottom: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 3,
    borderColor: "#444444",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  wheelFront: {
    left: 25,
  },
  wheelBack: {
    right: 25,
  },
  gradient: {
    flex: 1,
  },
  shadow: {
    position: "absolute",
    height: 12,
    backgroundColor: "#000000",
    opacity: 0.3,
    borderRadius: 100,
    transform: [{ scaleY: 0.2 }],
  },
});
