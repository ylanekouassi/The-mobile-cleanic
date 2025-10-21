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

interface RotatingCarProps {
  size?: number;
}

export default function RotatingCar({ size = 220 }: RotatingCarProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    // Subtle bounce animation
    scale.value = withRepeat(
      withTiming(1.05, {
        duration: 1500,
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
      rotation.value = savedRotation.value + event.translationX * 0.6;
    })
    .onEnd((event) => {
      rotation.value = withDecay({
        velocity: event.velocityX * 0.6,
        deceleration: 0.997,
      });

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
        { perspective: 800 },
        { rotateY: `${rotation.value}deg` },
        { rotateX: "15deg" },
        { scale: scale.value },
      ],
    };
  });

  // Animate faces based on rotation for 3D depth
  const frontFaceStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 45, 90, 180, 270, 315, 360],
      [1, 0.85, 0.6, 0.3, 0.6, 0.85, 1]
    );
    const brightness = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [1, 0.7, 0.5, 0.7, 1]
    );
    return { opacity, transform: [{ scale: brightness }] };
  });

  const rightFaceStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 45, 90, 135, 180, 270, 360],
      [0.3, 0.7, 1, 0.8, 0.5, 0.3, 0.3]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, 15, 0, -15, 0]
    );
    return { opacity, transform: [{ translateX }] };
  });

  const leftFaceStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 225, 270, 315, 360],
      [0.3, 0.3, 0.5, 0.8, 1, 0.7, 0.3]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, -15, 0, 15, 0]
    );
    return { opacity, transform: [{ translateX }] };
  });

  const topFaceStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0.9, 0.85, 0.9, 0.85, 0.9]
    );
    return { opacity };
  });

  const bottomFaceStyle = useAnimatedStyle(() => {
    return { opacity: 0.4 };
  });

  const backFaceStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 135, 180, 225, 270, 360],
      [0.3, 0.5, 0.8, 1, 0.8, 0.5, 0.3]
    );
    return { opacity };
  });

  const cubeSize = size * 0.7;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View style={[styles.cubeContainer, cubeAnimatedStyle]}>
          
          {/* Bottom Face - darkest */}
          <Animated.View style={[styles.face, styles.bottomFace, { width: cubeSize, height: cubeSize }, bottomFaceStyle]}>
            <View style={styles.minecraftTexture}>
              {renderPixelGrid("#8B6B3A", 8)}
            </View>
          </Animated.View>

          {/* Back Face */}
          <Animated.View style={[styles.face, styles.backFace, { width: cubeSize, height: cubeSize }, backFaceStyle]}>
            <View style={styles.minecraftTexture}>
              {renderPixelGrid("#B8956F", 8)}
            </View>
          </Animated.View>

          {/* Left Face */}
          <Animated.View style={[styles.face, styles.leftFace, { width: cubeSize, height: cubeSize }, leftFaceStyle]}>
            <View style={styles.minecraftTexture}>
              {renderPixelGrid("#D4A574", 8)}
            </View>
          </Animated.View>

          {/* Right Face */}
          <Animated.View style={[styles.face, styles.rightFace, { width: cubeSize, height: cubeSize }, rightFaceStyle]}>
            <View style={styles.minecraftTexture}>
              {renderPixelGrid("#E8B67D", 8)}
            </View>
          </Animated.View>

          {/* Top Face - brightest */}
          <Animated.View style={[styles.face, styles.topFace, { width: cubeSize, height: cubeSize }, topFaceStyle]}>
            <View style={styles.minecraftTexture}>
              {renderPixelGrid("#F5C98A", 8)}
            </View>
          </Animated.View>

          {/* Front Face - brightest with highlight */}
          <Animated.View style={[styles.face, styles.frontFace, { width: cubeSize, height: cubeSize }, frontFaceStyle]}>
            <View style={styles.minecraftTexture}>
              {renderPixelGrid("#FFD699", 8)}
            </View>
            {/* Minecraft-style highlight */}
            <View style={styles.minecraftHighlight} />
          </Animated.View>

        </Animated.View>

        {/* Blocky shadow */}
        <View style={[styles.blockyShadow, { width: cubeSize * 0.9, top: size * 0.72 }]} />
      </View>
    </GestureDetector>
  );
}

// Helper function to render Minecraft-style pixel grid
function renderPixelGrid(baseColor: string, gridSize: number) {
  const pixels = [];
  const pixelSize = 100 / gridSize;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Add random variation for Minecraft texture feel
      const variation = Math.random() > 0.7 ? 0.9 : 1;
      const shouldDarken = Math.random() > 0.85;
      
      pixels.push(
        <View
          key={`${row}-${col}`}
          style={{
            position: "absolute",
            left: `${col * pixelSize}%`,
            top: `${row * pixelSize}%`,
            width: `${pixelSize}%`,
            height: `${pixelSize}%`,
            backgroundColor: baseColor,
            opacity: shouldDarken ? 0.8 : variation,
            borderRightWidth: col < gridSize - 1 ? 0.5 : 0,
            borderBottomWidth: row < gridSize - 1 ? 0.5 : 0,
            borderColor: "rgba(0, 0, 0, 0.15)",
          }}
        />
      );
    }
  }
  
  return pixels;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cubeContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  face: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  minecraftTexture: {
    flex: 1,
    position: "relative",
  },
  minecraftHighlight: {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: "30%",
    height: "30%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  frontFace: {
    zIndex: 6,
  },
  backFace: {
    zIndex: 1,
  },
  rightFace: {
    zIndex: 4,
  },
  leftFace: {
    zIndex: 3,
  },
  topFace: {
    zIndex: 5,
  },
  bottomFace: {
    zIndex: 2,
  },
  blockyShadow: {
    position: "absolute",
    height: 20,
    backgroundColor: "#000000",
    opacity: 0.5,
    borderRadius: 4,
  },
});
