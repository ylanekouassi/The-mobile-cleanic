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
  const rotationY = useSharedValue(0);
  const rotationX = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotationY = useSharedValue(0);
  const savedRotationX = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);
  const autoRotationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

    return () => {
      if (autoRotationTimeoutRef.current) {
        clearTimeout(autoRotationTimeoutRef.current);
      }
      cancelAnimation(rotationY);
      cancelAnimation(rotationX);
      cancelAnimation(scale);
    };
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
      if (autoRotationTimeoutRef.current) {
        clearTimeout(autoRotationTimeoutRef.current);
      }
      savedRotationY.value = rotationY.value;
      savedRotationX.value = rotationX.value;
    })
    .onUpdate((event) => {
      // Rotation horizontale (gauche-droite) sur l'axe Y
      rotationY.value = savedRotationY.value + event.translationX * 0.8;
      // Rotation verticale (haut-bas) sur l'axe X
      rotationX.value = savedRotationX.value - event.translationY * 0.8;
    })
    .onEnd((event) => {
      rotationY.value = withDecay({
        velocity: event.velocityX * 0.5,
        deceleration: 0.995,
      });
      
      rotationX.value = withDecay({
        velocity: -event.velocityY * 0.5,
        deceleration: 0.995,
      });

      autoRotationTimeoutRef.current = setTimeout(() => {
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
