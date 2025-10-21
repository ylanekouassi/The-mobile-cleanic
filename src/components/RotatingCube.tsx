import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDecay,
  Easing,
  interpolate,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

interface RotatingCubeProps {
  size?: number;
}

export default function RotatingCube({ size = 180 }: RotatingCubeProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const tilt = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    // Subtle pulsing scale animation
    scale.value = withRepeat(
      withTiming(1.08, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Gentle tilt animation
    tilt.value = withRepeat(
      withTiming(15, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const startAutoRotation = () => {
    rotation.value = withRepeat(
      withTiming(rotation.value + 360, {
        duration: 6000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  };

  // Pan gesture to control rotation with touch
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Stop auto rotation when user starts touching
      if (isAutoRotating.value) {
        cancelAnimation(rotation);
        isAutoRotating.value = false;
      }
      savedRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      // Rotate based on horizontal drag
      rotation.value = savedRotation.value + event.translationX * 0.5;
    })
    .onEnd((event) => {
      // Add inertia with decay animation
      rotation.value = withDecay({
        velocity: event.velocityX * 0.5,
        deceleration: 0.998,
      });

      // Resume auto rotation after 2 seconds of no interaction
      setTimeout(() => {
        if (!isAutoRotating.value) {
          isAutoRotating.value = true;
          startAutoRotation();
        }
      }, 2000);
    });

  const cubeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
        { rotateX: `${tilt.value}deg` },
      ],
    };
  });

  // Create 6 faces with different opacity and positioning to simulate 3D
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = rotation.value % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [1, 0.6, 0.3, 0.6, 1]
    );
    return { opacity };
  });

  const side1AnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = rotation.value % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0.3, 1, 0.6, 0.3, 0.3]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, 15, 0, -15, 0]
    );
    return { opacity, transform: [{ translateX }] };
  });

  const side2AnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = rotation.value % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0.3, 0.6, 1, 0.6, 0.3]
    );
    return { opacity };
  });

  const side3AnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = rotation.value % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0.6, 0.3, 0.3, 1, 0.6]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, -15, 0, 15, 0]
    );
    return { opacity, transform: [{ translateX }] };
  });

  const faceSize = size * 0.85;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Outer glow */}
        <View style={[styles.outerGlow, { width: size * 1.6, height: size * 1.6 }]} />
        
        {/* Middle glow */}
        <View style={[styles.middleGlow, { width: size * 1.3, height: size * 1.3 }]} />

        <Animated.View style={[styles.cubeContainer, cubeAnimatedStyle]}>
          {/* Layer 4 - Back shadow */}
          <Animated.View
            style={[
              styles.face,
              styles.shadow,
              { width: faceSize, height: faceSize },
              side2AnimatedStyle,
            ]}
          />

          {/* Layer 3 - Left side */}
          <Animated.View
            style={[
              styles.face,
              { width: faceSize, height: faceSize },
              side3AnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#8B7B2F", "#B8960F", "#D4AF37"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Layer 2 - Right side */}
          <Animated.View
            style={[
              styles.face,
              { width: faceSize, height: faceSize },
              side1AnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#FFD700", "#F4E6A0", "#FFD700"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Layer 1 - Front face (brightest) */}
          <Animated.View
            style={[
              styles.face,
              styles.frontFace,
              { width: faceSize, height: faceSize },
              frontAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={["#FFD700", "#FFED4E", "#FFD700"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            {/* Inner shine */}
            <View style={styles.innerShine} />
          </Animated.View>
        </Animated.View>

        {/* Bottom reflection */}
        <View style={[styles.reflection, { width: faceSize, top: size * 0.7 }]} />
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
    backgroundColor: "#D4AF37",
    opacity: 0.08,
  },
  middleGlow: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#FFD700",
    opacity: 0.15,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  cubeContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  face: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  frontFace: {
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#D4AF37",
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  shadow: {
    backgroundColor: "#0a0a0a",
    borderWidth: 0,
    opacity: 0.3,
    transform: [{ scale: 0.95 }],
  },
  gradient: {
    flex: 1,
  },
  innerShine: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    transform: [{ rotate: "-3deg" }],
  },
  reflection: {
    position: "absolute",
    height: 20,
    backgroundColor: "#D4AF37",
    opacity: 0.1,
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
  },
});
