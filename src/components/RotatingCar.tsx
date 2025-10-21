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

    scale.value = withRepeat(
      withTiming(1.02, {
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
        duration: 12000,
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
        { perspective: 1200 },
        { rotateY: `${rotation.value}deg` },
        { rotateX: "-5deg" },
        { scale: scale.value },
      ],
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 30, 60, 120, 180, 240, 300, 330, 360],
      [1, 0.95, 0.75, 0.5, 0.3, 0.5, 0.75, 0.95, 1]
    );
    return { opacity };
  });

  const sideAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 30, 60, 90, 120, 180, 240, 300, 360],
      [0.35, 0.65, 0.9, 1, 0.95, 0.6, 0.4, 0.35, 0.35]
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
      [0, 60, 120, 150, 180, 210, 240, 300, 360],
      [0.3, 0.4, 0.6, 0.85, 1, 0.85, 0.6, 0.4, 0.3]
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View style={[styles.carContainer, carAnimatedStyle]}>
          
          {/* BACK LAYER - GTA/Minecraft Style Rear */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.porsche}>
              {/* Blocky rear spoiler */}
              <View style={styles.rearWing}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Rear body - blocky */}
              <View style={[styles.body, styles.bodyBack]}>
                <View style={styles.backPanel}>
                  <LinearGradient
                    colors={["#555555", "#3a3a3a"]}
                    style={styles.gradient}
                  />
                </View>
                {/* Chunky tail lights */}
                <View style={[styles.tailLight, { left: 28 }]} />
                <View style={[styles.tailLight, { right: 28 }]} />
                {/* Square exhausts */}
                <View style={[styles.exhaust, { left: 40 }]} />
                <View style={[styles.exhaust, { right: 40 }]} />
              </View>
              
              {/* Blocky roof */}
              <View style={[styles.roof, styles.roofBack]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>

          {/* SIDE LAYER - GTA/Minecraft Profile */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.porsche}>
              {/* Blocky wing side */}
              <View style={styles.rearWingSide}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Side body - flat panels */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#FF8C00", "#E89A3C", "#FF8C00"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                
                {/* Blocky window */}
                <View style={styles.sideWindow} />
                
                {/* Door line */}
                <View style={styles.doorLine} />
                
                {/* Side decal stripe */}
                <View style={styles.sideStripe} />
              </View>
              
              {/* Blocky roof */}
              <View style={[styles.roof, styles.roofSide]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Chunky wheels */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.tire} />
                <View style={styles.rim}>
                  <View style={styles.rimCenter} />
                </View>
              </View>
              
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.tire} />
                <View style={styles.rim}>
                  <View style={styles.rimCenter} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* FRONT LAYER - GTA/Minecraft Front */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.porsche}>
              {/* Blocky front bumper */}
              <View style={styles.frontBumper}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Front body - angular */}
              <View style={[styles.body, styles.bodyFront]}>
                <LinearGradient
                  colors={["#FFA500", "#FF8C00", "#E89A3C", "#FF8C00", "#FFA500"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                
                {/* Blocky headlights */}
                <View style={[styles.headlight, styles.headlightLeft]} />
                <View style={[styles.headlight, styles.headlightRight]} />
                
                {/* Front grille - chunky */}
                <View style={styles.frontGrille} />
                
                {/* Hood scoop */}
                <View style={styles.hoodScoop} />
              </View>
              
              {/* Windshield */}
              <View style={[styles.roof, styles.roofFront]}>
                <LinearGradient
                  colors={["#4a4a4a", "#3a3a3a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Hood */}
              <View style={styles.hood}>
                <LinearGradient
                  colors={["#FF8C00", "#E89A3C"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>
          
        </Animated.View>

        {/* Ground shadow */}
        <View style={[styles.shadow, { width: size * 0.5, top: size * 0.68 }]} />
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
  porsche: {
    width: 180,
    height: 95,
    position: "relative",
  },
  
  // BODY - Blocky GTA/Minecraft style
  body: {
    position: "absolute",
    bottom: 12,
    width: 180,
    height: 42,
    borderRadius: 2,
    overflow: "visible",
  },
  bodyFront: {
    borderWidth: 4,
    borderColor: "#000000",
    elevation: 12,
  },
  bodySide: {
    borderWidth: 3,
    borderColor: "#000000",
    elevation: 10,
  },
  bodyBack: {
    borderWidth: 3,
    borderColor: "#000000",
    elevation: 8,
  },
  
  // BACK PANEL
  backPanel: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  
  // ROOF - Blocky
  roof: {
    position: "absolute",
    top: 22,
    left: 55,
    width: 70,
    height: 24,
    borderRadius: 2,
    overflow: "hidden",
  },
  roofFront: {
    borderWidth: 3,
    borderColor: "#000000",
  },
  roofSide: {
    borderWidth: 3,
    borderColor: "#000000",
  },
  roofBack: {
    borderWidth: 3,
    borderColor: "#000000",
  },
  
  // WINDOWS - Blocky dark glass
  sideWindow: {
    position: "absolute",
    top: -12,
    left: 60,
    width: 60,
    height: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#000000",
  },
  
  // DOOR & DETAILS
  doorLine: {
    position: "absolute",
    top: 8,
    left: 85,
    width: 3,
    height: 28,
    backgroundColor: "#000000",
  },
  sideStripe: {
    position: "absolute",
    top: 16,
    left: 20,
    width: 140,
    height: 4,
    backgroundColor: "#000000",
  },
  
  // HEADLIGHTS - Chunky yellow blocks
  headlight: {
    position: "absolute",
    top: 12,
    width: 18,
    height: 14,
    backgroundColor: "#FFFF00",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#000000",
  },
  headlightLeft: {
    left: 18,
  },
  headlightRight: {
    right: 18,
  },
  
  // TAIL LIGHTS - Chunky red blocks
  tailLight: {
    position: "absolute",
    top: 14,
    width: 20,
    height: 12,
    backgroundColor: "#FF0000",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#000000",
  },
  
  // EXHAUSTS - Square pipes
  exhaust: {
    position: "absolute",
    bottom: 4,
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#0a0a0a",
    borderWidth: 3,
    borderColor: "#000000",
  },
  
  // FRONT GRILLE
  frontGrille: {
    position: "absolute",
    bottom: 8,
    left: 70,
    width: 40,
    height: 16,
    backgroundColor: "#0a0a0a",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#000000",
  },
  
  // HOOD
  hood: {
    position: "absolute",
    top: 8,
    left: 60,
    width: 60,
    height: 16,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#000000",
  },
  hoodScoop: {
    position: "absolute",
    top: 4,
    left: 75,
    width: 30,
    height: 8,
    backgroundColor: "#0a0a0a",
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#000000",
  },
  
  // REAR WING/SPOILER - Blocky
  rearWing: {
    position: "absolute",
    top: 16,
    left: 50,
    width: 80,
    height: 8,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#000000",
    elevation: 10,
  },
  rearWingSide: {
    position: "absolute",
    top: 18,
    left: 52,
    width: 76,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 3,
    borderColor: "#000000",
    elevation: 8,
  },
  frontBumper: {
    position: "absolute",
    bottom: 8,
    left: 30,
    width: 120,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#000000",
    elevation: 8,
  },
  
  // WHEELS - Chunky GTA style
  wheel: {
    position: "absolute",
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 2,
    backgroundColor: "#0a0a0a",
    borderWidth: 4,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  wheelFront: {
    left: 26,
  },
  wheelBack: {
    right: 26,
  },
  tire: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
  },
  rim: {
    width: 20,
    height: 20,
    borderRadius: 2,
    backgroundColor: "#555555",
    borderWidth: 3,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  rimCenter: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#FFA500",
    borderWidth: 2,
    borderColor: "#000000",
  },
  
  gradient: {
    flex: 1,
  },
  
  shadow: {
    position: "absolute",
    height: 16,
    backgroundColor: "#000000",
    opacity: 0.6,
    borderRadius: 100,
    transform: [{ scaleY: 0.25 }],
  },
});
