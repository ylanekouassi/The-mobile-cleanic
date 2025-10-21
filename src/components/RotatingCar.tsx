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
      withTiming(1.015, {
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
        duration: 14000,
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
        { rotateX: "-8deg" },
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
    const translateZ = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, -14, 0, 14, 0]
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
          
          {/* BACK LAYER - Porsche Rear */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.porsche}>
              {/* Iconic Porsche rear spoiler */}
              <View style={styles.rearWing}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
                <View style={styles.wingSupport} />
              </View>
              
              {/* Rear body - curved */}
              <View style={[styles.body, styles.bodyBack]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
                {/* Porsche tail light strip */}
                <View style={styles.tailLightStrip}>
                  <LinearGradient
                    colors={["#ff1a1a", "#cc0000", "#ff1a1a"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                {/* Porsche badge */}
                <View style={styles.porscheBadge} />
                {/* Dual exhaust */}
                <View style={[styles.exhaust, { left: 35 }]} />
                <View style={[styles.exhaust, { right: 35 }]} />
              </View>
              
              {/* Roof - coupe style */}
              <View style={[styles.roof, styles.roofBack]} />
            </View>
          </Animated.View>

          {/* SIDE LAYER - Porsche Profile */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.porsche}>
              {/* Rear wing side view */}
              <View style={styles.rearWingSide}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Side body - classic Porsche curve */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#E89A3C", "#D4822C", "#C67B2E", "#D4822C", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Side window - coupe style */}
                <View style={styles.sideWindow} />
                
                {/* Door handle */}
                <View style={styles.doorHandle} />
                
                {/* Side air intake */}
                <View style={styles.sideAirIntake}>
                  <View style={styles.intakeBar} />
                  <View style={[styles.intakeBar, { top: 4 }]} />
                  <View style={[styles.intakeBar, { top: 8 }]} />
                </View>
                
                {/* Character line */}
                <View style={styles.characterLine} />
                
                {/* Side skirt */}
                <View style={styles.sideSkirt} />
              </View>
              
              {/* Coupe roof - low and sleek */}
              <View style={[styles.roof, styles.roofSide]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Iconic Porsche wheels */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.brakeDisk} />
                <View style={styles.brakeCaliper} />
                <View style={styles.porscheRim}>
                  {/* 5-spoke design */}
                  <View style={styles.rimSpoke} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "72deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "144deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "216deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "288deg" }] }]} />
                </View>
                <View style={styles.porscheCenterCap} />
              </View>
              
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.brakeDisk} />
                <View style={styles.brakeCaliper} />
                <View style={styles.porscheRim}>
                  <View style={styles.rimSpoke} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "72deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "144deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "216deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "288deg" }] }]} />
                </View>
                <View style={styles.porscheCenterCap} />
              </View>
            </View>
          </Animated.View>

          {/* FRONT LAYER - Porsche Front */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.porsche}>
              {/* Front splitter */}
              <View style={styles.frontSplitter}>
                <LinearGradient
                  colors={["#0a0a0a", "#000000"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Front body */}
              <View style={[styles.body, styles.bodyFront]}>
                <LinearGradient
                  colors={["#FFB347", "#E89A3C", "#D4822C", "#E89A3C", "#FFB347"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Porsche LED headlights - 4-point design */}
                <View style={[styles.porscheHeadlight, styles.headlightLeft]}>
                  <View style={styles.ledDot} />
                  <View style={[styles.ledDot, { top: 3, left: 3 }]} />
                  <View style={[styles.ledDot, { top: 6 }]} />
                  <View style={[styles.ledDot, { top: 9, left: 3 }]} />
                </View>
                <View style={[styles.porscheHeadlight, styles.headlightRight]}>
                  <View style={styles.ledDot} />
                  <View style={[styles.ledDot, { top: 3, right: 3 }]} />
                  <View style={[styles.ledDot, { top: 6 }]} />
                  <View style={[styles.ledDot, { top: 9, right: 3 }]} />
                </View>
                
                {/* Front grille - minimal Porsche style */}
                <View style={styles.frontGrille}>
                  <View style={styles.grilleSlat} />
                  <View style={[styles.grilleSlat, { top: 4 }]} />
                  <View style={[styles.grilleSlat, { top: 8 }]} />
                </View>
                
                {/* Hood vents */}
                <View style={styles.hoodVents}>
                  <View style={styles.hoodVent} />
                  <View style={[styles.hoodVent, { left: 18 }]} />
                </View>
                
                {/* Front air intakes */}
                <View style={[styles.frontIntake, { left: 18 }]} />
                <View style={[styles.frontIntake, { right: 18 }]} />
              </View>
              
              {/* Windshield - very sloped */}
              <View style={[styles.roof, styles.roofFront]}>
                <LinearGradient
                  colors={["#4a4a4a", "#3a3a3a", "#2a2a2a"]}
                  style={styles.gradient}
                />
                <View style={styles.windshieldGlare} />
              </View>
              
              {/* Hood */}
              <View style={styles.hood}>
                <LinearGradient
                  colors={["#E89A3C", "#D4822C"]}
                  style={styles.gradient}
                />
                {/* Porsche crest */}
                <View style={styles.porscheCrest} />
              </View>
            </View>
          </Animated.View>
          
        </Animated.View>

        {/* Ground shadow */}
        <View style={[styles.shadow, { width: size * 0.52, top: size * 0.68 }]} />
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
    width: 200,
    height: 105,
    position: "relative",
  },
  
  // BODY - Low sports car profile
  body: {
    position: "absolute",
    bottom: 14,
    width: 200,
    height: 44,
    borderRadius: 8,
    overflow: "visible",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  bodyFront: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.45)",
    elevation: 14,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bodySide: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 10,
  },
  bodyBack: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  
  // ROOF - Low coupe
  roof: {
    position: "absolute",
    top: 20,
    left: 65,
    width: 70,
    height: 26,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  roofFront: {
    borderWidth: 2,
    borderColor: "rgba(140, 140, 140, 0.6)",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  roofSide: {
    borderWidth: 1.5,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  roofBack: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  
  // WINDOWS
  sideWindow: {
    position: "absolute",
    top: -14,
    left: 70,
    width: 58,
    height: 14,
    backgroundColor: "rgba(70, 90, 110, 0.6)",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(100, 140, 180, 0.4)",
    transform: [{ skewX: "-8deg" }],
  },
  windshieldGlare: {
    position: "absolute",
    top: 4,
    left: 8,
    width: 28,
    height: 12,
    backgroundColor: "rgba(200, 220, 255, 0.4)",
    borderRadius: 6,
    transform: [{ skewX: "-18deg" }],
  },
  
  // DOOR & DETAILS
  doorHandle: {
    position: "absolute",
    top: 16,
    left: 90,
    width: 16,
    height: 3,
    backgroundColor: "rgba(150, 150, 150, 0.7)",
    borderRadius: 1.5,
  },
  characterLine: {
    position: "absolute",
    top: 14,
    left: 30,
    width: 140,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  sideSkirt: {
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
  
  // PORSCHE HEADLIGHTS - 4-point LED
  porscheHeadlight: {
    position: "absolute",
    top: 14,
    width: 20,
    height: 16,
    backgroundColor: "rgba(255, 255, 250, 0.98)",
    borderRadius: 4,
    shadowColor: "#FFFACD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  headlightLeft: {
    left: 14,
  },
  headlightRight: {
    right: 14,
  },
  ledDot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowRadius: 3,
    top: 2,
    left: 2,
  },
  
  // TAIL LIGHT STRIP
  tailLightStrip: {
    position: "absolute",
    top: 16,
    left: 30,
    width: 140,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(200, 0, 0, 0.8)",
  },
  
  // EXHAUSTS
  exhaust: {
    position: "absolute",
    bottom: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1a1a1a",
    borderWidth: 2.5,
    borderColor: "#555555",
  },
  
  // AIR INTAKES
  sideAirIntake: {
    position: "absolute",
    bottom: 10,
    left: 30,
    width: 24,
    height: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.3)",
  },
  intakeBar: {
    position: "absolute",
    width: 20,
    height: 1.5,
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    left: 2,
    top: 2,
  },
  frontIntake: {
    position: "absolute",
    bottom: 6,
    width: 22,
    height: 12,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(130, 130, 130, 0.4)",
  },
  frontGrille: {
    position: "absolute",
    bottom: 10,
    left: 82,
    width: 36,
    height: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.5)",
  },
  grilleSlat: {
    position: "absolute",
    width: 32,
    height: 1,
    backgroundColor: "rgba(120, 120, 120, 0.6)",
    left: 2,
    top: 2,
  },
  
  // HOOD
  hood: {
    position: "absolute",
    top: 10,
    left: 70,
    width: 60,
    height: 12,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  hoodVents: {
    position: "absolute",
    top: 6,
    left: 82,
    width: 36,
    height: 10,
  },
  hoodVent: {
    position: "absolute",
    width: 12,
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.25)",
    left: 6,
  },
  
  // PORSCHE BADGES
  porscheCrest: {
    position: "absolute",
    top: 2,
    left: 24,
    width: 12,
    height: 12,
    backgroundColor: "#FFD700",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#000000",
  },
  porscheBadge: {
    position: "absolute",
    top: 28,
    left: 94,
    width: 12,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#000000",
  },
  
  // REAR WING/SPOILER
  rearWing: {
    position: "absolute",
    top: 14,
    left: 60,
    width: 80,
    height: 10,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(130, 130, 130, 0.5)",
    elevation: 8,
  },
  wingSupport: {
    position: "absolute",
    bottom: -6,
    left: 10,
    width: 4,
    height: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#444444",
  },
  rearWingSide: {
    position: "absolute",
    top: 16,
    left: 62,
    width: 76,
    height: 6,
    borderRadius: 1,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
    elevation: 6,
  },
  frontSplitter: {
    position: "absolute",
    bottom: 10,
    left: 35,
    width: 130,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(130, 130, 130, 0.5)",
    elevation: 6,
  },
  
  // WHEELS - Porsche 5-spoke
  wheel: {
    position: "absolute",
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0a0a0a",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelFront: {
    left: 32,
  },
  wheelBack: {
    right: 32,
  },
  brakeDisk: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
    borderWidth: 2,
    borderColor: "#444444",
  },
  brakeCaliper: {
    position: "absolute",
    width: 7,
    height: 11,
    backgroundColor: "#E89A3C",
    borderRadius: 2,
    left: 5,
    top: 10,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#C67B2E",
  },
  porscheRim: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#777777",
    alignItems: "center",
    justifyContent: "center",
  },
  rimSpoke: {
    position: "absolute",
    width: 2,
    height: 16,
    backgroundColor: "#999999",
  },
  porscheCenterCap: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  
  gradient: {
    flex: 1,
  },
  
  shadow: {
    position: "absolute",
    height: 14,
    backgroundColor: "#000000",
    opacity: 0.5,
    borderRadius: 100,
    transform: [{ scaleY: 0.2 }],
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});
