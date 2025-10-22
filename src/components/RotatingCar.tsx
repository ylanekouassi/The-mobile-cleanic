import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDecay,
  Easing,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface RotatingCarProps {
  size?: number;
}

// Helper function to normalize rotation values between 0-360
const normalizeRotation = (rotation: number): number => {
  const normalized = rotation % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

export default function RotatingCar({ size = 280 }: RotatingCarProps) {
  const rotationY = useSharedValue(0);
  const rotationX = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotationY = useSharedValue(0);
  const savedRotationX = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

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
    rotationY.value = withRepeat(
      withTiming(rotationY.value + 360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isAutoRotating.value) {
        cancelAnimation(rotationY);
        cancelAnimation(rotationX);
        isAutoRotating.value = false;
      }
      // Normalize before saving to prevent overflow
      rotationY.value = normalizeRotation(rotationY.value);
      rotationX.value = normalizeRotation(rotationX.value);
      savedRotationY.value = rotationY.value;
      savedRotationX.value = rotationX.value;
    })
    .onUpdate((event) => {
      // Rotation horizontale (gauche-droite) sur l'axe Y
      const newRotationY = savedRotationY.value + event.translationX * 1.0;
      rotationY.value = normalizeRotation(newRotationY);
      
      // Rotation verticale (haut-bas) sur l'axe X
      const newRotationX = savedRotationX.value - event.translationY * 1.0;
      rotationX.value = normalizeRotation(newRotationX);
    })
    .onEnd((event) => {
      // Use smaller velocity multipliers to prevent extreme values
      rotationY.value = withDecay({
        velocity: event.velocityX * 0.5,
        deceleration: 0.995,
        clamp: [-720, 720], // Limit the decay range
      }, (finished) => {
        if (finished) {
          rotationY.value = normalizeRotation(rotationY.value);
        }
      });
      
      rotationX.value = withDecay({
        velocity: -event.velocityY * 0.5,
        deceleration: 0.995,
        clamp: [-720, 720], // Limit the decay range
      }, (finished) => {
        if (finished) {
          rotationX.value = normalizeRotation(rotationX.value);
        }
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
        { rotateY: `${rotationY.value % 360}deg` },
        { rotateX: `${rotationX.value % 360}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View style={[styles.carContainer, carAnimatedStyle]}>
          <Image
            source={require("../../assets/g-wagon.png")}
            style={styles.carImage}
            resizeMode="contain"
          />
        </Animated.View>
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
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
});
