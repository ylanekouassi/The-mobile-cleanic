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
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View style={[styles.carContainer, carAnimatedStyle]}>
          <Image
            source={require("../../assets/bmw-m3.png")}
            style={styles.carImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Ambient glow - Need for Speed style */}
        <View style={[styles.ambientGlow, { width: size * 0.8, height: size * 0.4, top: size * 0.5 }]} />
        
        {/* Ground shadow */}
        <View style={[styles.shadow, { width: size * 0.6, top: size * 0.7 }]} />
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
  shadow: {
    position: "absolute",
    height: 20,
    backgroundColor: "#000000",
    opacity: 0.5,
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
  },
  ambientGlow: {
    position: "absolute",
    backgroundColor: "#FF8C00",
    opacity: 0.2,
    borderRadius: 200,
    transform: [{ scaleY: 0.3 }],
    zIndex: -1,
  },
});
