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

export default function RotatingCar({ size = 280 }: RotatingCarProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    // Subtle pulsing scale animation
    scale.value = withRepeat(
      withTiming(1.02, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const startAutoRotation = () => {
    rotation.value = withRepeat(
      withTiming(rotation.value + 360, {
        duration: 12000,
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
        { perspective: 1000 },
        { rotateY: `${rotation.value}deg` },
        { rotateX: "-5deg" },
        { scale: scale.value },
      ],
    };
  });

  // Animate different parts based on rotation for 3D depth
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 45, 90, 180, 270, 315, 360],
      [1, 0.9, 0.6, 0.3, 0.6, 0.9, 1]
    );
    const translateZ = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, -10, 0, 10, 0]
    );
    return { 
      opacity,
      transform: [{ translateX: translateZ }],
    };
  });

  const sideAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 45, 90, 135, 180, 270, 360],
      [0.4, 0.8, 1, 0.9, 0.5, 0.4, 0.4]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, 25, 0, -25, 0]
    );
    return { 
      opacity, 
      transform: [{ translateX }],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 135, 180, 225, 270, 360],
      [0.3, 0.5, 0.8, 1, 0.8, 0.5, 0.3]
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View style={[styles.carContainer, carAnimatedStyle]}>
          {/* Back layer - darker */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.sportsCar}>
              {/* Rear spoiler */}
              <View style={styles.rearSpoiler}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              {/* Car Body Back */}
              <View style={[styles.carBody, styles.carBodyBack]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a", "#2a2a2a"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Tail lights */}
                <View style={[styles.tailLight, { left: 15 }]} />
                <View style={[styles.tailLight, { right: 15 }]} />
              </View>
              {/* Roof Back */}
              <View style={[styles.carRoof, styles.roofBack]}>
                <LinearGradient
                  colors={["#0a0a0a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>

          {/* Side layer */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.sportsCar}>
              {/* Side spoiler */}
              <View style={[styles.sideSpoiler]}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              {/* Car Body Side */}
              <View style={[styles.carBody, styles.carBodySide]}>
                <LinearGradient
                  colors={["#FFB347", "#E89A3C", "#C67B2E", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Side window */}
                <View style={styles.sideWindow} />
                {/* Door line detail */}
                <View style={styles.doorLine} />
                {/* Air intake */}
                <View style={styles.airIntake} />
              </View>
              {/* Roof Side - sleek and low */}
              <View style={[styles.carRoof, styles.roofSide]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              </View>
              {/* Wheels - sporty design */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.wheelRim} />
                <View style={styles.wheelSpoke} />
                <View style={[styles.wheelSpoke, { transform: [{ rotate: "45deg" }] }]} />
                <View style={[styles.wheelSpoke, { transform: [{ rotate: "90deg" }] }]} />
                <View style={[styles.wheelSpoke, { transform: [{ rotate: "135deg" }] }]} />
              </View>
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.wheelRim} />
                <View style={styles.wheelSpoke} />
                <View style={[styles.wheelSpoke, { transform: [{ rotate: "45deg" }] }]} />
                <View style={[styles.wheelSpoke, { transform: [{ rotate: "90deg" }] }]} />
                <View style={[styles.wheelSpoke, { transform: [{ rotate: "135deg" }] }]} />
              </View>
            </View>
          </Animated.View>

          {/* Front layer - brightest */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.sportsCar}>
              {/* Front spoiler/splitter */}
              <View style={styles.frontSplitter}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              {/* Car Body Front */}
              <View style={[styles.carBody, styles.carBodyFront]}>
                <LinearGradient
                  colors={["#FFD580", "#FFB347", "#E89A3C", "#FFB347"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Headlights - aggressive design */}
                <View style={[styles.headlight, styles.headlightLeft]} />
                <View style={[styles.headlight, styles.headlightRight]} />
                {/* Hood vent detail */}
                <View style={styles.hoodVent} />
              </View>
              {/* Roof Front - aerodynamic */}
              <View style={[styles.carRoof, styles.roofFront]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                {/* Windshield reflection */}
                <View style={styles.windshieldGlare} />
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Ground shadow - more realistic */}
        <View style={[styles.shadow, { width: size * 0.65, top: size * 0.68 }]} />
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
  sportsCar: {
    width: 180,
    height: 100,
    position: "relative",
  },
  carBody: {
    position: "absolute",
    bottom: 8,
    width: 180,
    height: 55,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  carBodyFront: {
    borderWidth: 2.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    elevation: 12,
  },
  carBodySide: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    elevation: 8,
  },
  carBodyBack: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    elevation: 4,
  },
  carRoof: {
    position: "absolute",
    top: 15,
    left: 50,
    width: 80,
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  roofFront: {
    borderWidth: 1.5,
    borderColor: "rgba(120, 120, 120, 0.5)",
  },
  roofSide: {
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  roofBack: {
    borderWidth: 1,
    borderColor: "rgba(80, 80, 80, 0.2)",
  },
  sideWindow: {
    position: "absolute",
    top: -18,
    left: 55,
    width: 70,
    height: 18,
    backgroundColor: "rgba(100, 150, 200, 0.4)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(150, 200, 255, 0.3)",
  },
  doorLine: {
    position: "absolute",
    top: 15,
    left: 90,
    width: 1,
    height: 35,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  airIntake: {
    position: "absolute",
    bottom: 8,
    left: 30,
    width: 20,
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  headlight: {
    position: "absolute",
    top: 18,
    width: 18,
    height: 14,
    backgroundColor: "rgba(255, 255, 240, 0.95)",
    borderRadius: 4,
    shadowColor: "#FFFACD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  headlightLeft: {
    left: 12,
  },
  headlightRight: {
    right: 12,
  },
  tailLight: {
    position: "absolute",
    top: 18,
    width: 14,
    height: 12,
    backgroundColor: "rgba(255, 50, 50, 0.8)",
    borderRadius: 3,
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  hoodVent: {
    position: "absolute",
    top: 8,
    left: "50%",
    marginLeft: -15,
    width: 30,
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  windshieldGlare: {
    position: "absolute",
    top: 3,
    left: 8,
    width: 25,
    height: 12,
    backgroundColor: "rgba(200, 220, 255, 0.3)",
    borderRadius: 4,
    transform: [{ skewX: "-10deg" }],
  },
  rearSpoiler: {
    position: "absolute",
    top: 8,
    left: 40,
    width: 100,
    height: 8,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  sideSpoiler: {
    position: "absolute",
    top: 10,
    left: 42,
    width: 96,
    height: 6,
    borderRadius: 1,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  frontSplitter: {
    position: "absolute",
    bottom: 4,
    left: 35,
    width: 110,
    height: 6,
    borderRadius: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  wheel: {
    position: "absolute",
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#0a0a0a",
    borderWidth: 4,
    borderColor: "#333333",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelFront: {
    left: 30,
  },
  wheelBack: {
    right: 30,
  },
  wheelRim: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#666666",
    borderWidth: 2,
    borderColor: "#888888",
  },
  wheelSpoke: {
    position: "absolute",
    width: 2,
    height: 18,
    backgroundColor: "#555555",
  },
  gradient: {
    flex: 1,
  },
  shadow: {
    position: "absolute",
    height: 15,
    backgroundColor: "#000000",
    opacity: 0.4,
    borderRadius: 100,
    transform: [{ scaleY: 0.2 }],
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
