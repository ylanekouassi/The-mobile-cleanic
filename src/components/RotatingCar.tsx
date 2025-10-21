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
        { rotateX: "-6deg" },
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
      [0, -12, 0, 12, 0]
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
      [0, 28, 0, -28, 0]
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
          
          {/* BACK LAYER - BMW M3 Rear */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.bmwM3}>
              {/* Subtle rear spoiler - M3 style */}
              <View style={styles.m3Spoiler}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Sedan body - back */}
              <View style={[styles.body, styles.bodyBack]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
                {/* M3 tail lights - L-shaped */}
                <View style={[styles.m3TailLight, styles.m3TailLightLeft]}>
                  <View style={styles.tailLightBar} />
                </View>
                <View style={[styles.m3TailLight, styles.m3TailLightRight]}>
                  <View style={styles.tailLightBar} />
                </View>
                {/* Quad exhaust */}
                <View style={styles.exhaustSystem}>
                  <View style={[styles.exhaust, { left: 20 }]} />
                  <View style={[styles.exhaust, { left: 35 }]} />
                  <View style={[styles.exhaust, { right: 35 }]} />
                  <View style={[styles.exhaust, { right: 20 }]} />
                </View>
                {/* BMW badge */}
                <View style={styles.bmwBadgeBack} />
              </View>
              
              {/* Roof - sedan proportions */}
              <View style={[styles.roof, styles.roofBack]} />
              
              {/* Trunk */}
              <View style={styles.trunk} />
            </View>
          </Animated.View>

          {/* SIDE LAYER - BMW M3 Profile */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.bmwM3}>
              {/* Roof spoiler lip */}
              <View style={styles.roofSpoilerLip}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Main sedan body */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#E89A3C", "#D4822C", "#C67B2E", "#D4822C", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Four door windows */}
                <View style={[styles.window, styles.frontWindow]} />
                <View style={[styles.window, styles.rearWindow]} />
                
                {/* M-style side mirror */}
                <View style={styles.mSideMirror}>
                  <LinearGradient
                    colors={["#2a2a2a", "#1a1a1a"]}
                    style={styles.gradient}
                  />
                </View>
                
                {/* M3 side gills/vents */}
                <View style={styles.sideGills}>
                  <View style={styles.gill} />
                  <View style={[styles.gill, { top: 4 }]} />
                  <View style={[styles.gill, { top: 8 }]} />
                </View>
                
                {/* Door handles */}
                <View style={[styles.doorHandle, { left: 55 }]} />
                <View style={[styles.doorHandle, { left: 115 }]} />
                
                {/* M stripe on side skirt */}
                <View style={styles.mStripe}>
                  <View style={[styles.mStripeSegment, { backgroundColor: "#0066B3" }]} />
                  <View style={[styles.mStripeSegment, { backgroundColor: "#DC143C", left: 5 }]} />
                </View>
                
                {/* Hofmeister kink (BMW signature C-pillar) */}
                <View style={styles.hofmeisterKink} />
              </View>
              
              {/* Sedan roof */}
              <View style={[styles.roof, styles.roofSide]}>
                <LinearGradient
                  colors={["#3a3a3a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* M Performance wheels */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.brakeDisk} />
                <View style={styles.mCaliper} />
                <View style={styles.mRim}>
                  {/* M double-spoke design */}
                  <View style={styles.mSpoke} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "45deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "90deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "135deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "22.5deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "67.5deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "112.5deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "157.5deg" }] }]} />
                </View>
                <View style={styles.mCenterCap}>
                  <View style={styles.bmwLogo} />
                </View>
              </View>
              
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.brakeDisk} />
                <View style={styles.mCaliper} />
                <View style={styles.mRim}>
                  <View style={styles.mSpoke} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "45deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "90deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "135deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "22.5deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "67.5deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "112.5deg" }] }]} />
                  <View style={[styles.mSpoke, { transform: [{ rotate: "157.5deg" }] }]} />
                </View>
                <View style={styles.mCenterCap}>
                  <View style={styles.bmwLogo} />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* FRONT LAYER - BMW M3 Front with Kidney Grilles */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.bmwM3}>
              {/* Front lip spoiler */}
              <View style={styles.frontLip}>
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
                
                {/* Iconic BMW kidney grilles */}
                <View style={styles.kidneyGrilleContainer}>
                  <View style={[styles.kidneyGrille, styles.kidneyGrilleLeft]}>
                    <View style={styles.grilleSlat} />
                    <View style={[styles.grilleSlat, { top: 5 }]} />
                    <View style={[styles.grilleSlat, { top: 10 }]} />
                    <View style={[styles.grilleSlat, { top: 15 }]} />
                    <View style={[styles.grilleSlat, { top: 20 }]} />
                  </View>
                  <View style={[styles.kidneyGrille, styles.kidneyGrilleRight]}>
                    <View style={styles.grilleSlat} />
                    <View style={[styles.grilleSlat, { top: 5 }]} />
                    <View style={[styles.grilleSlat, { top: 10 }]} />
                    <View style={[styles.grilleSlat, { top: 15 }]} />
                    <View style={[styles.grilleSlat, { top: 20 }]} />
                  </View>
                </View>
                
                {/* BMW angel eyes headlights */}
                <View style={[styles.angelEyes, styles.angelEyesLeft]}>
                  <View style={styles.angelEyeRing} />
                  <View style={styles.ledModule} />
                </View>
                <View style={[styles.angelEyes, styles.angelEyesRight]}>
                  <View style={styles.angelEyeRing} />
                  <View style={styles.ledModule} />
                </View>
                
                {/* BMW logo on hood */}
                <View style={styles.bmwHoodBadge} />
                
                {/* M3 hood vents */}
                <View style={styles.m3HoodVents}>
                  <View style={styles.hoodVent} />
                  <View style={[styles.hoodVent, { left: 16 }]} />
                </View>
                
                {/* Front air intakes */}
                <View style={[styles.frontIntake, { left: 15 }]} />
                <View style={[styles.frontIntake, { right: 15 }]} />
              </View>
              
              {/* Windshield */}
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
              </View>
            </View>
          </Animated.View>
          
        </Animated.View>

        {/* Ground shadow */}
        <View style={[styles.shadow, { width: size * 0.58, top: size * 0.66 }]} />
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
  bmwM3: {
    width: 220,
    height: 110,
    position: "relative",
  },
  
  // BODY - Sedan proportions
  body: {
    position: "absolute",
    bottom: 14,
    width: 220,
    height: 52,
    borderRadius: 8,
    overflow: "visible",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  bodyFront: {
    borderWidth: 2.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    elevation: 12,
  },
  bodySide: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    elevation: 8,
  },
  bodyBack: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 5,
  },
  
  // ROOF - Sedan roof
  roof: {
    position: "absolute",
    top: 18,
    left: 55,
    width: 110,
    height: 34,
    borderRadius: 6,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  roofFront: {
    borderWidth: 1.5,
    borderColor: "rgba(140, 140, 140, 0.5)",
  },
  roofSide: {
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  roofBack: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  
  // WINDOWS
  window: {
    position: "absolute",
    top: -18,
    height: 18,
    backgroundColor: "rgba(60, 90, 120, 0.55)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(100, 140, 180, 0.4)",
  },
  frontWindow: {
    left: 60,
    width: 48,
  },
  rearWindow: {
    left: 112,
    width: 48,
  },
  windshieldGlare: {
    position: "absolute",
    top: 5,
    left: 12,
    width: 35,
    height: 16,
    backgroundColor: "rgba(200, 220, 255, 0.35)",
    borderRadius: 6,
    transform: [{ skewX: "-12deg" }],
  },
  
  // HOFMEISTER KINK - BMW signature
  hofmeisterKink: {
    position: "absolute",
    top: -18,
    left: 158,
    width: 12,
    height: 18,
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  
  // KIDNEY GRILLES - BMW iconic feature
  kidneyGrilleContainer: {
    position: "absolute",
    top: 16,
    left: 85,
    flexDirection: "row",
    gap: 4,
  },
  kidneyGrille: {
    width: 18,
    height: 26,
    backgroundColor: "#000000",
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#333333",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  kidneyGrilleLeft: {},
  kidneyGrilleRight: {},
  grilleSlat: {
    position: "absolute",
    width: 14,
    height: 1.5,
    backgroundColor: "#1a1a1a",
    left: 2,
    top: 2,
  },
  
  // ANGEL EYES HEADLIGHTS
  angelEyes: {
    position: "absolute",
    top: 14,
    width: 22,
    height: 18,
    backgroundColor: "rgba(255, 255, 250, 0.95)",
    borderRadius: 6,
    shadowColor: "#FFFACD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  angelEyesLeft: {
    left: 18,
  },
  angelEyesRight: {
    right: 18,
  },
  angelEyeRing: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "transparent",
  },
  ledModule: {
    width: 16,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: "absolute",
    bottom: 2,
    borderRadius: 1.5,
  },
  
  // M3 TAIL LIGHTS
  m3TailLight: {
    position: "absolute",
    top: 16,
    width: 20,
    height: 18,
    backgroundColor: "rgba(220, 30, 30, 0.9)",
    borderRadius: 4,
    shadowColor: "#DC0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(180, 0, 0, 0.7)",
  },
  m3TailLightLeft: {
    left: 22,
  },
  m3TailLightRight: {
    right: 22,
  },
  tailLightBar: {
    position: "absolute",
    width: 3,
    height: 14,
    backgroundColor: "rgba(255, 50, 50, 1)",
    left: 2,
    top: 2,
  },
  
  // QUAD EXHAUST - M3 signature
  exhaustSystem: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    height: 12,
  },
  exhaust: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#555555",
  },
  
  // SIDE GILLS
  sideGills: {
    position: "absolute",
    top: 12,
    left: 38,
    width: 18,
    height: 12,
  },
  gill: {
    position: "absolute",
    width: 16,
    height: 1.5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    left: 1,
    top: 1,
  },
  
  // M STRIPE
  mStripe: {
    position: "absolute",
    bottom: 4,
    left: 50,
    width: 120,
    height: 3,
    flexDirection: "row",
  },
  mStripeSegment: {
    position: "absolute",
    width: 40,
    height: 3,
  },
  
  // MIRRORS
  mSideMirror: {
    position: "absolute",
    top: -8,
    left: 58,
    width: 14,
    height: 9,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  
  // DOOR HANDLES
  doorHandle: {
    position: "absolute",
    top: 18,
    width: 18,
    height: 4,
    backgroundColor: "rgba(150, 150, 150, 0.6)",
    borderRadius: 2,
  },
  
  // HOOD
  hood: {
    position: "absolute",
    top: 8,
    left: 70,
    width: 80,
    height: 12,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  
  // BMW BADGES
  bmwHoodBadge: {
    position: "absolute",
    top: 8,
    left: 104,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0066B3",
  },
  bmwBadgeBack: {
    position: "absolute",
    top: 18,
    left: 104,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0066B3",
  },
  
  // HOOD VENTS
  m3HoodVents: {
    position: "absolute",
    top: 4,
    left: 86,
    width: 48,
    height: 10,
  },
  hoodVent: {
    position: "absolute",
    width: 14,
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(200, 200, 200, 0.2)",
    left: 8,
  },
  
  // FRONT INTAKES
  frontIntake: {
    position: "absolute",
    bottom: 8,
    width: 24,
    height: 14,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  
  // TRUNK
  trunk: {
    position: "absolute",
    bottom: 14,
    left: 65,
    width: 90,
    height: 14,
    backgroundColor: "rgba(232, 154, 60, 0.3)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(200, 130, 50, 0.3)",
  },
  
  // SPOILERS
  m3Spoiler: {
    position: "absolute",
    top: 16,
    left: 65,
    width: 90,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  roofSpoilerLip: {
    position: "absolute",
    top: 18,
    left: 67,
    width: 86,
    height: 4,
    borderRadius: 1,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  frontLip: {
    position: "absolute",
    bottom: 10,
    left: 40,
    width: 140,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.4)",
  },
  
  // WHEELS - M Performance
  wheel: {
    position: "absolute",
    bottom: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0a0a0a",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelFront: {
    left: 34,
  },
  wheelBack: {
    right: 34,
  },
  brakeDisk: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2a2a2a",
    borderWidth: 2,
    borderColor: "#444444",
  },
  mCaliper: {
    position: "absolute",
    width: 8,
    height: 12,
    backgroundColor: "#E89A3C",
    borderRadius: 2,
    left: 5,
    top: 11,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#C67B2E",
  },
  mRim: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
  },
  mSpoke: {
    position: "absolute",
    width: 2,
    height: 18,
    backgroundColor: "#888888",
  },
  mCenterCap: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0066B3",
    alignItems: "center",
    justifyContent: "center",
  },
  bmwLogo: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0066B3",
  },
  
  gradient: {
    flex: 1,
  },
  
  shadow: {
    position: "absolute",
    height: 16,
    backgroundColor: "#000000",
    opacity: 0.45,
    borderRadius: 100,
    transform: [{ scaleY: 0.18 }],
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
