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

export default function RotatingCar({ size = 300 }: RotatingCarProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    scale.value = withRepeat(
      withTiming(1.015, {
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
        duration: 15000,
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

  // Different layers for 3D effect
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
      [0, -15, 0, 15, 0]
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
          
          {/* BACK LAYER */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.supercar}>
              {/* Rear massive spoiler - Lamborghini style */}
              <View style={styles.massiveSpoiler}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a", "#000000"]}
                  style={styles.gradient}
                />
                <View style={styles.spoilerSupport} />
              </View>
              
              {/* Low aggressive body - back */}
              <View style={[styles.body, styles.bodyBack]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
                {/* Hexagonal tail lights */}
                <View style={[styles.hexTailLight, styles.hexTailLightLeft]} />
                <View style={[styles.hexTailLight, styles.hexTailLightRight]} />
                {/* Rear diffuser */}
                <View style={styles.rearDiffuser} />
              </View>
              
              {/* Very low roof line */}
              <View style={[styles.roof, styles.roofBack]} />
            </View>
          </Animated.View>

          {/* SIDE LAYER */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.supercar}>
              {/* Aerodynamic side spoiler */}
              <View style={styles.sideSpoiler}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Main body - sleek and low */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#FFB347", "#E89A3C", "#D4822C", "#E89A3C", "#FFB347"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Angular side window - supercar style */}
                <View style={styles.angularWindow} />
                
                {/* Sharp character line */}
                <View style={styles.characterLine} />
                
                {/* Side air intake - aggressive */}
                <View style={styles.sideIntake}>
                  <View style={styles.intakeSlat} />
                  <View style={[styles.intakeSlat, { top: 4 }]} />
                  <View style={[styles.intakeSlat, { top: 8 }]} />
                </View>
                
                {/* Side mirror */}
                <View style={styles.sideMirror}>
                  <LinearGradient
                    colors={["#1a1a1a", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                </View>
                
                {/* Carbon fiber side skirt */}
                <View style={styles.sideSkirt} />
              </View>
              
              {/* Low aggressive roof */}
              <View style={[styles.roof, styles.roofSide]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Large performance wheels */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.brakeDisk} />
                <View style={styles.caliper} />
                <View style={styles.rim}>
                  <View style={styles.rimSpoke} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "60deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "120deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "30deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "90deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "150deg" }] }]} />
                </View>
                <View style={styles.centerCap} />
              </View>
              
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.brakeDisk} />
                <View style={styles.caliper} />
                <View style={styles.rim}>
                  <View style={styles.rimSpoke} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "60deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "120deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "30deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "90deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "150deg" }] }]} />
                </View>
                <View style={styles.centerCap} />
              </View>
            </View>
          </Animated.View>

          {/* FRONT LAYER */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.supercar}>
              {/* Front splitter - aggressive and low */}
              <View style={styles.frontSplitter}>
                <LinearGradient
                  colors={["#0a0a0a", "#000000"]}
                  style={styles.gradient}
                />
                <View style={styles.splitterFin} />
              </View>
              
              {/* Aggressive front body */}
              <View style={[styles.body, styles.bodyFront]}>
                <LinearGradient
                  colors={["#FFD580", "#FFB347", "#E89A3C", "#D4822C", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Sharp LED headlights - Y-shape like Lamborghini */}
                <View style={[styles.yShapeHeadlight, styles.yShapeHeadlightLeft]}>
                  <View style={styles.ledStrip} />
                  <View style={[styles.ledStrip, { transform: [{ rotate: "30deg" }], top: 2, left: 2 }]} />
                  <View style={[styles.ledStrip, { transform: [{ rotate: "-30deg" }], top: 2, right: 2 }]} />
                </View>
                <View style={[styles.yShapeHeadlight, styles.yShapeHeadlightRight]}>
                  <View style={styles.ledStrip} />
                  <View style={[styles.ledStrip, { transform: [{ rotate: "30deg" }], top: 2, left: 2 }]} />
                  <View style={[styles.ledStrip, { transform: [{ rotate: "-30deg" }], top: 2, right: 2 }]} />
                </View>
                
                {/* Front grille/intake */}
                <View style={styles.frontGrille}>
                  <View style={styles.grilleSlat} />
                  <View style={[styles.grilleSlat, { top: 6 }]} />
                  <View style={[styles.grilleSlat, { top: 12 }]} />
                </View>
                
                {/* Hood vents - racing style */}
                <View style={styles.hoodVents}>
                  <View style={styles.hoodVent} />
                  <View style={[styles.hoodVent, { left: 14 }]} />
                </View>
              </View>
              
              {/* Windshield - aggressive angle */}
              <View style={[styles.roof, styles.roofFront]}>
                <LinearGradient
                  colors={["#4a4a4a", "#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
                {/* Windshield glare */}
                <View style={styles.windshieldGlare} />
              </View>
            </View>
          </Animated.View>
          
        </Animated.View>

        {/* Realistic ground shadow */}
        <View style={[styles.shadow, { width: size * 0.55, top: size * 0.65 }]} />
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
  supercar: {
    width: 220,
    height: 110,
    position: "relative",
  },
  
  // BODY STYLES - very low and wide
  body: {
    position: "absolute",
    bottom: 12,
    width: 220,
    height: 48,
    borderRadius: 6,
    overflow: "visible",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  bodyFront: {
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.45)",
    elevation: 15,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  bodySide: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    elevation: 10,
  },
  bodyBack: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  
  // ROOF - very low supercar roof
  roof: {
    position: "absolute",
    top: 22,
    left: 70,
    width: 80,
    height: 28,
    borderRadius: 6,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  roofFront: {
    borderWidth: 2,
    borderColor: "rgba(140, 140, 140, 0.6)",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  roofSide: {
    borderWidth: 1.5,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  roofBack: {
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  
  // WINDOWS
  angularWindow: {
    position: "absolute",
    top: -16,
    left: 75,
    width: 65,
    height: 16,
    backgroundColor: "rgba(80, 120, 160, 0.5)",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(120, 160, 200, 0.4)",
    transform: [{ skewX: "-5deg" }],
  },
  windshieldGlare: {
    position: "absolute",
    top: 4,
    left: 10,
    width: 30,
    height: 14,
    backgroundColor: "rgba(200, 220, 255, 0.4)",
    borderRadius: 6,
    transform: [{ skewX: "-15deg" }],
  },
  
  // CHARACTER LINES
  characterLine: {
    position: "absolute",
    top: 18,
    left: 20,
    width: 180,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  
  // SIDE MIRROR
  sideMirror: {
    position: "absolute",
    top: -10,
    left: 65,
    width: 12,
    height: 8,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  
  // SIDE SKIRT
  sideSkirt: {
    position: "absolute",
    bottom: -2,
    left: 40,
    width: 140,
    height: 8,
    backgroundColor: "#0a0a0a",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(80, 80, 80, 0.5)",
  },
  
  // HEADLIGHTS - Y-shape like Lamborghini
  yShapeHeadlight: {
    position: "absolute",
    top: 12,
    width: 24,
    height: 20,
    backgroundColor: "rgba(255, 255, 245, 0.98)",
    borderRadius: 4,
    shadowColor: "#FFFACD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    transform: [{ skewX: "-8deg" }],
  },
  yShapeHeadlightLeft: {
    left: 8,
  },
  yShapeHeadlightRight: {
    right: 8,
  },
  ledStrip: {
    position: "absolute",
    width: 16,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 1)",
    top: 8,
    left: 4,
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  
  // TAIL LIGHTS - Hexagonal
  hexTailLight: {
    position: "absolute",
    top: 14,
    width: 18,
    height: 16,
    backgroundColor: "rgba(255, 20, 20, 0.95)",
    borderRadius: 3,
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(200, 0, 0, 0.8)",
    transform: [{ rotate: "45deg" }],
  },
  hexTailLightLeft: {
    left: 18,
  },
  hexTailLightRight: {
    right: 18,
  },
  
  // FRONT GRILLE
  frontGrille: {
    position: "absolute",
    bottom: 8,
    left: 85,
    width: 50,
    height: 18,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "rgba(80, 80, 80, 0.6)",
  },
  grilleSlat: {
    position: "absolute",
    width: 46,
    height: 1,
    backgroundColor: "rgba(100, 100, 100, 0.6)",
    left: 2,
    top: 3,
  },
  
  // HOOD VENTS
  hoodVents: {
    position: "absolute",
    top: 4,
    left: 88,
    width: 44,
    height: 12,
  },
  hoodVent: {
    position: "absolute",
    width: 12,
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    left: 8,
  },
  
  // SIDE INTAKE
  sideIntake: {
    position: "absolute",
    bottom: 10,
    left: 35,
    width: 28,
    height: 12,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.3)",
  },
  intakeSlat: {
    position: "absolute",
    width: 24,
    height: 1,
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    left: 2,
    top: 2,
  },
  
  // REAR DIFFUSER
  rearDiffuser: {
    position: "absolute",
    bottom: 0,
    left: 50,
    width: 120,
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  
  // SPOILERS
  massiveSpoiler: {
    position: "absolute",
    top: 12,
    left: 50,
    width: 120,
    height: 12,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(120, 120, 120, 0.5)",
    elevation: 8,
  },
  spoilerSupport: {
    position: "absolute",
    bottom: -8,
    left: 20,
    width: 3,
    height: 10,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333333",
  },
  sideSpoiler: {
    position: "absolute",
    top: 14,
    left: 52,
    width: 116,
    height: 8,
    borderRadius: 1,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
    elevation: 5,
  },
  frontSplitter: {
    position: "absolute",
    bottom: 8,
    left: 30,
    width: 160,
    height: 8,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(120, 120, 120, 0.5)",
    elevation: 6,
  },
  splitterFin: {
    position: "absolute",
    bottom: -4,
    left: 70,
    width: 20,
    height: 6,
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: "#333333",
  },
  
  // WHEELS - Large performance wheels
  wheel: {
    position: "absolute",
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#050505",
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2a2a2a",
    borderWidth: 2,
    borderColor: "#444444",
  },
  caliper: {
    position: "absolute",
    width: 8,
    height: 12,
    backgroundColor: "#E89A3C",
    borderRadius: 2,
    left: 6,
    top: 12,
    zIndex: 10,
  },
  rim: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#555555",
    alignItems: "center",
    justifyContent: "center",
  },
  rimSpoke: {
    position: "absolute",
    width: 2,
    height: 20,
    backgroundColor: "#777777",
  },
  centerCap: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999999",
    borderWidth: 1,
    borderColor: "#BBBBBB",
  },
  
  gradient: {
    flex: 1,
  },
  
  shadow: {
    position: "absolute",
    height: 18,
    backgroundColor: "#000000",
    opacity: 0.5,
    borderRadius: 100,
    transform: [{ scaleY: 0.15 }],
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});
