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
      [0, 30, 0, -30, 0]
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
          
          {/* BACK LAYER - G-Wagon Rear */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.gWagon}>
              {/* Roof rack */}
              <View style={styles.roofRack}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Rear body - boxy SUV shape */}
              <View style={[styles.body, styles.bodyBack]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a"]}
                  style={styles.gradient}
                />
                
                {/* Spare tire on back */}
                <View style={styles.spareTire}>
                  <View style={styles.spareTireRim} />
                </View>
                
                {/* Tail lights */}
                <View style={styles.tailLightLeft} />
                <View style={styles.tailLightRight} />
                
                {/* Mercedes badge */}
                <View style={styles.mercedesBadge} />
              </View>
              
              {/* Roof - boxy */}
              <View style={[styles.roof, styles.roofBack]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>

          {/* SIDE LAYER - G-Wagon Profile */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.gWagon}>
              {/* Roof rack side */}
              <View style={styles.roofRackSide}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Side body - ORANGE */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#E89A3C", "#D4822C", "#E89A3C", "#FFA500"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                
                {/* Side windows - vertical */}
                <View style={styles.sideWindowFront} />
                <View style={styles.sideWindowBack} />
                
                {/* Door handles */}
                <View style={[styles.doorHandle, { left: 50 }]} />
                <View style={[styles.doorHandle, { left: 120 }]} />
                
                {/* Side steps */}
                <View style={styles.sideStep} />
                
                {/* Fender flares */}
                <View style={[styles.fenderFlare, { left: 25 }]} />
                <View style={[styles.fenderFlare, { right: 25 }]} />
              </View>
              
              {/* Roof - flat boxy */}
              <View style={[styles.roof, styles.roofSide]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* G-Wagon Wheels - big and rugged */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.tire} />
                <View style={styles.rim}>
                  <View style={styles.rimSpoke} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "45deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "90deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "135deg" }] }]} />
                </View>
                <View style={styles.mercedesCenterCap} />
              </View>
              
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.tire} />
                <View style={styles.rim}>
                  <View style={styles.rimSpoke} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "45deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "90deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "135deg" }] }]} />
                </View>
                <View style={styles.mercedesCenterCap} />
              </View>
            </View>
          </Animated.View>

          {/* FRONT LAYER - G-Wagon Front */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.gWagon}>
              {/* Front bumper - aggressive */}
              <View style={styles.frontBumper}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Front body - ORANGE */}
              <View style={[styles.body, styles.bodyFront]}>
                <LinearGradient
                  colors={["#FFA500", "#E89A3C", "#D4822C", "#E89A3C", "#FFA500"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                
                {/* G-Wagon iconic grille */}
                <View style={styles.grille}>
                  <LinearGradient
                    colors={["#1a1a1a", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                  <View style={styles.grilleBar} />
                  <View style={[styles.grilleBar, { top: 10 }]} />
                  <View style={[styles.grilleBar, { top: 20 }]} />
                </View>
                
                {/* Mercedes star on grille */}
                <View style={styles.mercedesStar} />
                
                {/* Round headlights - G-Wagon signature */}
                <View style={[styles.headlight, styles.headlightLeft]} />
                <View style={[styles.headlight, styles.headlightRight]} />
                
                {/* Turn signals */}
                <View style={[styles.turnSignal, { left: 18 }]} />
                <View style={[styles.turnSignal, { right: 18 }]} />
                
                {/* Hood vents */}
                <View style={styles.hoodVent} />
              </View>
              
              {/* Windshield - upright G-Wagon style */}
              <View style={[styles.roof, styles.roofFront]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Hood - boxy */}
              <View style={styles.hood}>
                <LinearGradient
                  colors={["#E89A3C", "#D4822C"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>
          
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
  gWagon: {
    width: 200,
    height: 120,
    position: "relative",
  },
  
  // BODY - Boxy SUV shape
  body: {
    position: "absolute",
    bottom: 16,
    width: 200,
    height: 60,
    borderRadius: 4,
    overflow: "visible",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  bodyFront: {
    borderWidth: 2,
    borderColor: "rgba(255, 200, 100, 0.4)",
    elevation: 14,
  },
  bodySide: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 180, 80, 0.3)",
    elevation: 12,
  },
  bodyBack: {
    borderWidth: 1,
    borderColor: "rgba(50, 50, 50, 0.5)",
    elevation: 8,
  },
  
  // ROOF - Flat and boxy
  roof: {
    position: "absolute",
    top: 12,
    left: 50,
    width: 100,
    height: 40,
    borderRadius: 3,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  roofFront: {
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.5)",
  },
  roofSide: {
    borderWidth: 1,
    borderColor: "rgba(80, 80, 80, 0.4)",
  },
  roofBack: {
    borderWidth: 1,
    borderColor: "rgba(60, 60, 60, 0.3)",
  },
  
  // ROOF RACK
  roofRack: {
    position: "absolute",
    top: 8,
    left: 52,
    width: 96,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#444444",
  },
  roofRackSide: {
    position: "absolute",
    top: 10,
    left: 54,
    width: 92,
    height: 4,
    borderRadius: 1,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333333",
  },
  
  // WINDOWS
  sideWindowFront: {
    position: "absolute",
    top: -24,
    left: 55,
    width: 40,
    height: 24,
    backgroundColor: "rgba(20, 30, 40, 0.8)",
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  sideWindowBack: {
    position: "absolute",
    top: -24,
    left: 100,
    width: 45,
    height: 24,
    backgroundColor: "rgba(20, 30, 40, 0.8)",
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  
  // GRILLE - G-Wagon signature
  grille: {
    position: "absolute",
    top: 16,
    left: 70,
    width: 60,
    height: 32,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  grilleBar: {
    position: "absolute",
    left: 5,
    width: 50,
    height: 2,
    backgroundColor: "#444444",
    top: 5,
  },
  
  // MERCEDES STAR
  mercedesStar: {
    position: "absolute",
    top: 28,
    left: 98,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C0C0C0",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  
  // HEADLIGHTS - Round G-Wagon style
  headlight: {
    position: "absolute",
    top: 18,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 250, 0.95)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(200, 200, 200, 0.6)",
  },
  headlightLeft: {
    left: 30,
  },
  headlightRight: {
    right: 30,
  },
  
  // TURN SIGNALS
  turnSignal: {
    position: "absolute",
    top: 42,
    width: 16,
    height: 8,
    borderRadius: 2,
    backgroundColor: "rgba(255, 180, 0, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(200, 140, 0, 0.7)",
  },
  
  // TAIL LIGHTS
  tailLightLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 18,
    height: 24,
    borderRadius: 3,
    backgroundColor: "#CC0000",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(150, 0, 0, 0.6)",
  },
  tailLightRight: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 18,
    height: 24,
    borderRadius: 3,
    backgroundColor: "#CC0000",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(150, 0, 0, 0.6)",
  },
  
  // SPARE TIRE
  spareTire: {
    position: "absolute",
    top: 14,
    left: 85,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  spareTireRim: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#444444",
    borderWidth: 1.5,
    borderColor: "#666666",
  },
  
  // BADGES
  mercedesBadge: {
    position: "absolute",
    bottom: 8,
    left: 94,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#C0C0C0",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  mercedesCenterCap: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C0C0C0",
    borderWidth: 1.5,
    borderColor: "#2a2a2a",
  },
  
  // HOOD
  hood: {
    position: "absolute",
    top: 4,
    left: 65,
    width: 70,
    height: 14,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 80, 0.3)",
  },
  hoodVent: {
    position: "absolute",
    top: 6,
    left: 90,
    width: 20,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.3)",
  },
  
  // BUMPERS
  frontBumper: {
    position: "absolute",
    bottom: 12,
    left: 30,
    width: 140,
    height: 8,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.5)",
  },
  
  // SIDE DETAILS
  doorHandle: {
    position: "absolute",
    top: 24,
    width: 14,
    height: 4,
    backgroundColor: "rgba(150, 150, 150, 0.8)",
    borderRadius: 2,
  },
  sideStep: {
    position: "absolute",
    bottom: -2,
    left: 30,
    width: 140,
    height: 6,
    backgroundColor: "#0a0a0a",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(80, 80, 80, 0.5)",
  },
  fenderFlare: {
    position: "absolute",
    bottom: 8,
    width: 18,
    height: 28,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  
  // WHEELS - Big and rugged
  wheel: {
    position: "absolute",
    bottom: 6,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0a0a0a",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelFront: {
    left: 30,
  },
  wheelBack: {
    right: 30,
  },
  tire: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 21,
    backgroundColor: "#1a1a1a",
    borderWidth: 3,
    borderColor: "#2a2a2a",
  },
  rim: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#3a3a3a",
    borderWidth: 2,
    borderColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
  },
  rimSpoke: {
    position: "absolute",
    width: 3,
    height: 24,
    backgroundColor: "#888888",
  },
  
  gradient: {
    flex: 1,
  },
});
