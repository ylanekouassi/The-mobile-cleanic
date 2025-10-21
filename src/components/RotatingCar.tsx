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
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isAutoRotating.value) {
        cancelAnimation(rotation);
        isAutoRotating.value = false;
      }
      savedRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      // Increased sensitivity from 0.5 to 1.0 for more responsive movement
      rotation.value = savedRotation.value + event.translationX * 1.0;
    })
    .onEnd((event) => {
      rotation.value = withDecay({
        // Increased velocity multiplier from 0.5 to 1.0 for smoother flick
        velocity: event.velocityX * 1.0,
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
