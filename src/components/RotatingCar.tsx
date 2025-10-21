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
      withTiming(1.01, {
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
        { perspective: 1500 },
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
      [0, -18, 0, 18, 0]
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
      [0, 35, 0, -35, 0]
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
          
          {/* BACK LAYER - BMW M3 Rear (Need for Speed style) */}
          <Animated.View style={[styles.carLayer, backAnimatedStyle]}>
            <View style={styles.bmw}>
              {/* M3 Rear Spoiler */}
              <View style={styles.rearSpoiler}>
                <LinearGradient
                  colors={["#0a0a0a", "#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <View style={styles.spoilerEdge} />
              </View>
              
              {/* Rear Body */}
              <View style={[styles.body, styles.bodyBack]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
                
                {/* BMW Tail Lights - Red LED strips */}
                <View style={styles.tailLightLeft}>
                  <LinearGradient
                    colors={["#8B0000", "#FF0000", "#FF4444", "#FF0000", "#8B0000"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  <View style={styles.tailLightGlow} />
                </View>
                <View style={styles.tailLightRight}>
                  <LinearGradient
                    colors={["#8B0000", "#FF0000", "#FF4444", "#FF0000", "#8B0000"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  <View style={styles.tailLightGlow} />
                </View>
                
                {/* BMW Badge */}
                <View style={styles.bmwBadge}>
                  <View style={styles.bmwBadgeInner} />
                </View>
                
                {/* M3 Badge */}
                <View style={styles.m3Badge} />
                
                {/* Quad Exhaust - M3 signature */}
                <View style={styles.exhaustLeft}>
                  <View style={styles.exhaustPipe} />
                  <View style={[styles.exhaustPipe, { left: 14 }]} />
                </View>
                <View style={styles.exhaustRight}>
                  <View style={styles.exhaustPipe} />
                  <View style={[styles.exhaustPipe, { right: 14 }]} />
                </View>
              </View>
              
              {/* Roof */}
              <View style={[styles.roof, styles.roofBack]}>
                <LinearGradient
                  colors={["#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>

          {/* SIDE LAYER - BMW M3 Profile (Need for Speed style) */}
          <Animated.View style={[styles.carLayer, sideAnimatedStyle]}>
            <View style={styles.bmw}>
              {/* Spoiler side view */}
              <View style={styles.rearSpoilerSide}>
                <LinearGradient
                  colors={["#0a0a0a", "#1a1a1a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Side Body - Metallic orange with reflections */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#FF6B00", "#FF8C00", "#FFA500", "#FF8C00", "#E67300", "#FF6B00"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                
                {/* Side Window */}
                <View style={styles.sideWindow}>
                  <LinearGradient
                    colors={["#1a1a2a", "#0a0a1a", "#000000"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <View style={styles.windowReflection} />
                </View>
                
                {/* M3 Side Gill/Vent */}
                <View style={styles.sideGill}>
                  <View style={styles.gillSlat} />
                  <View style={[styles.gillSlat, { top: 5 }]} />
                  <View style={[styles.gillSlat, { top: 10 }]} />
                </View>
                
                {/* M Sport Side Skirt */}
                <View style={styles.sideSkirt}>
                  <LinearGradient
                    colors={["#0a0a0a", "#1a1a1a", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                </View>
                
                {/* Character Line - M3 signature */}
                <View style={styles.characterLine} />
                
                {/* Door Handle */}
                <View style={styles.doorHandle} />
                
                {/* M Stripe */}
                <View style={styles.mStripe}>
                  <View style={styles.mStripeBlue} />
                  <View style={styles.mStripePurple} />
                  <View style={styles.mStripeRed} />
                </View>
              </View>
              
              {/* Roof - Carbon fiber look */}
              <View style={[styles.roof, styles.roofSide]}>
                <LinearGradient
                  colors={["#2a2a2a", "#1a1a1a", "#0a0a0a"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* M3 Wheels - Performance style */}
              <View style={[styles.wheel, styles.wheelFront]}>
                <View style={styles.tire} />
                <View style={styles.brakeDisk} />
                <View style={styles.brakeCaliper} />
                <View style={styles.m3Rim}>
                  {/* 5-spoke M wheel design */}
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "0deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "72deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "144deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "216deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "288deg" }] }]} />
                  <View style={styles.rimCenter} />
                </View>
                <View style={styles.mBadgeWheel} />
              </View>
              
              <View style={[styles.wheel, styles.wheelBack]}>
                <View style={styles.tire} />
                <View style={styles.brakeDisk} />
                <View style={styles.brakeCaliper} />
                <View style={styles.m3Rim}>
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "0deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "72deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "144deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "216deg" }] }]} />
                  <View style={[styles.rimSpoke, { transform: [{ rotate: "288deg" }] }]} />
                  <View style={styles.rimCenter} />
                </View>
                <View style={styles.mBadgeWheel} />
              </View>
            </View>
          </Animated.View>

          {/* FRONT LAYER - BMW M3 Front (Need for Speed style) */}
          <Animated.View style={[styles.carLayer, frontAnimatedStyle]}>
            <View style={styles.bmw}>
              {/* Front Splitter */}
              <View style={styles.frontSplitter}>
                <LinearGradient
                  colors={["#0a0a0a", "#000000"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Front Body */}
              <View style={[styles.body, styles.bodyFront]}>
                <LinearGradient
                  colors={["#FFA500", "#FF8C00", "#FF6B00", "#FF8C00", "#FFA500"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                
                {/* BMW Kidney Grilles - Iconic */}
                <View style={styles.kidneyGrilleLeft}>
                  <LinearGradient
                    colors={["#0a0a0a", "#1a1a1a", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                  <View style={styles.grilleSlat} />
                  <View style={[styles.grilleSlat, { top: 6 }]} />
                  <View style={[styles.grilleSlat, { top: 12 }]} />
                </View>
                <View style={styles.kidneyGrilleRight}>
                  <LinearGradient
                    colors={["#0a0a0a", "#1a1a1a", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                  <View style={styles.grilleSlat} />
                  <View style={[styles.grilleSlat, { top: 6 }]} />
                  <View style={[styles.grilleSlat, { top: 12 }]} />
                </View>
                
                {/* Angel Eyes Headlights - BMW signature */}
                <View style={[styles.headlight, styles.headlightLeft]}>
                  <LinearGradient
                    colors={["#FFFFFF", "#E0E0FF", "#FFFFFF"]}
                    style={styles.gradient}
                  />
                  <View style={styles.angelEye} />
                  <View style={styles.headlightGlow} />
                </View>
                <View style={[styles.headlight, styles.headlightRight]}>
                  <LinearGradient
                    colors={["#FFFFFF", "#E0E0FF", "#FFFFFF"]}
                    style={styles.gradient}
                  />
                  <View style={styles.angelEye} />
                  <View style={styles.headlightGlow} />
                </View>
                
                {/* Front Air Intakes */}
                <View style={[styles.frontIntake, { left: 12 }]}>
                  <LinearGradient
                    colors={["#000000", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                </View>
                <View style={[styles.frontIntake, { right: 12 }]}>
                  <LinearGradient
                    colors={["#000000", "#0a0a0a"]}
                    style={styles.gradient}
                  />
                </View>
                
                {/* M3 Badge Front */}
                <View style={styles.m3BadgeFront} />
              </View>
              
              {/* Windshield */}
              <View style={[styles.roof, styles.roofFront]}>
                <LinearGradient
                  colors={["#3a3a4a", "#2a2a3a", "#1a1a2a"]}
                  style={styles.gradient}
                />
                <View style={styles.windshieldGlare} />
              </View>
              
              {/* Hood */}
              <View style={styles.hood}>
                <LinearGradient
                  colors={["#FF8C00", "#FF6B00", "#E67300"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                {/* Hood Power Dome */}
                <View style={styles.hoodDome} />
                {/* Carbon Fiber Hood Vents */}
                <View style={styles.hoodVent} />
                <View style={[styles.hoodVent, { left: 30 }]} />
              </View>
            </View>
          </Animated.View>
          
        </Animated.View>

        {/* Ground shadow - more realistic */}
        <View style={[styles.shadow, { width: size * 0.55, top: size * 0.7 }]} />
        
        {/* Ambient glow - Need for Speed style */}
        <View style={[styles.ambientGlow, { width: size * 0.7, height: size * 0.3, top: size * 0.55 }]} />
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
  bmw: {
    width: 220,
    height: 110,
    position: "relative",
  },
  
  // BODY - M3 aggressive profile
  body: {
    position: "absolute",
    bottom: 16,
    width: 220,
    height: 50,
    borderRadius: 10,
    overflow: "visible",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },
  bodyFront: {
    borderWidth: 2,
    borderColor: "rgba(255, 200, 100, 0.4)",
    elevation: 16,
  },
  bodySide: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 180, 80, 0.3)",
    elevation: 14,
  },
  bodyBack: {
    borderWidth: 1,
    borderColor: "rgba(50, 50, 50, 0.5)",
    elevation: 10,
  },
  
  // ROOF - Sedan profile
  roof: {
    position: "absolute",
    top: 18,
    left: 70,
    width: 80,
    height: 30,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  roofFront: {
    borderWidth: 1,
    borderColor: "rgba(100, 100, 120, 0.5)",
  },
  roofSide: {
    borderWidth: 1,
    borderColor: "rgba(80, 80, 100, 0.4)",
  },
  roofBack: {
    borderWidth: 1,
    borderColor: "rgba(60, 60, 80, 0.3)",
  },
  
  // WINDOWS
  sideWindow: {
    position: "absolute",
    top: -16,
    left: 75,
    width: 70,
    height: 16,
    backgroundColor: "#0a0a1a",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 120, 0.3)",
    overflow: "hidden",
  },
  windowReflection: {
    position: "absolute",
    top: 2,
    left: 5,
    width: 30,
    height: 8,
    backgroundColor: "rgba(100, 150, 255, 0.15)",
    borderRadius: 3,
  },
  windshieldGlare: {
    position: "absolute",
    top: 4,
    left: 10,
    width: 35,
    height: 15,
    backgroundColor: "rgba(150, 180, 255, 0.25)",
    borderRadius: 8,
  },
  
  // BMW KIDNEY GRILLES - Iconic
  kidneyGrilleLeft: {
    position: "absolute",
    top: 12,
    left: 70,
    width: 28,
    height: 22,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  kidneyGrilleRight: {
    position: "absolute",
    top: 12,
    right: 70,
    width: 28,
    height: 22,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  grilleSlat: {
    position: "absolute",
    left: 4,
    width: 20,
    height: 2,
    backgroundColor: "rgba(80, 80, 80, 0.8)",
    top: 3,
  },
  
  // ANGEL EYES HEADLIGHTS - BMW signature
  headlight: {
    position: "absolute",
    top: 10,
    width: 24,
    height: 18,
    borderRadius: 6,
    overflow: "hidden",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(200, 200, 255, 0.6)",
  },
  headlightLeft: {
    left: 20,
  },
  headlightRight: {
    right: 20,
  },
  angelEye: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 18,
    height: 12,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "rgba(180, 200, 255, 0.8)",
    backgroundColor: "transparent",
  },
  headlightGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  
  // TAIL LIGHTS - LED strips
  tailLightLeft: {
    position: "absolute",
    top: 16,
    left: 20,
    width: 30,
    height: 14,
    borderRadius: 4,
    overflow: "hidden",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(200, 0, 0, 0.6)",
  },
  tailLightRight: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 30,
    height: 14,
    borderRadius: 4,
    overflow: "hidden",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(200, 0, 0, 0.6)",
  },
  tailLightGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 100, 100, 0.4)",
  },
  
  // BMW BADGES
  bmwBadge: {
    position: "absolute",
    top: 32,
    left: 104,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#0066B3",
    alignItems: "center",
    justifyContent: "center",
  },
  bmwBadgeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0066B3",
  },
  m3Badge: {
    position: "absolute",
    bottom: 6,
    right: 90,
    width: 18,
    height: 6,
    backgroundColor: "#1a1a1a",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  m3BadgeFront: {
    position: "absolute",
    bottom: 8,
    left: 104,
    width: 12,
    height: 4,
    backgroundColor: "#1a1a1a",
    borderRadius: 1,
    borderWidth: 0.5,
    borderColor: "#FFA500",
  },
  
  // M SPORT DETAILS
  sideGill: {
    position: "absolute",
    top: 16,
    left: 30,
    width: 20,
    height: 14,
  },
  gillSlat: {
    position: "absolute",
    left: 0,
    width: 18,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    top: 0,
  },
  sideSkirt: {
    position: "absolute",
    bottom: -2,
    left: 30,
    width: 160,
    height: 8,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.4)",
  },
  characterLine: {
    position: "absolute",
    top: 18,
    left: 30,
    width: 160,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  doorHandle: {
    position: "absolute",
    top: 20,
    left: 100,
    width: 18,
    height: 4,
    backgroundColor: "rgba(150, 150, 150, 0.8)",
    borderRadius: 2,
  },
  
  // M STRIPE - Iconic BMW M colors
  mStripe: {
    position: "absolute",
    top: 6,
    left: 100,
    width: 50,
    height: 4,
    flexDirection: "row",
    borderRadius: 2,
    overflow: "hidden",
  },
  mStripeBlue: {
    flex: 1,
    backgroundColor: "#0066B3",
  },
  mStripePurple: {
    flex: 1,
    backgroundColor: "#6600CC",
  },
  mStripeRed: {
    flex: 1,
    backgroundColor: "#CC0000",
  },
  
  // EXHAUST - Quad pipes (M3 signature)
  exhaustLeft: {
    position: "absolute",
    bottom: 6,
    left: 30,
    width: 32,
    height: 10,
  },
  exhaustRight: {
    position: "absolute",
    bottom: 6,
    right: 30,
    width: 32,
    height: 10,
  },
  exhaustPipe: {
    position: "absolute",
    width: 12,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0a0a0a",
    borderWidth: 2,
    borderColor: "#444444",
    left: 0,
  },
  
  // HOOD
  hood: {
    position: "absolute",
    top: 8,
    left: 75,
    width: 70,
    height: 12,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 180, 80, 0.3)",
  },
  hoodDome: {
    position: "absolute",
    top: 2,
    left: 25,
    width: 20,
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 10,
  },
  hoodVent: {
    position: "absolute",
    top: 2,
    left: 10,
    width: 10,
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(200, 200, 200, 0.3)",
  },
  
  // FRONT INTAKES
  frontIntake: {
    position: "absolute",
    bottom: 8,
    width: 26,
    height: 14,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(100, 100, 100, 0.5)",
  },
  
  // SPOILER
  rearSpoiler: {
    position: "absolute",
    top: 12,
    left: 60,
    width: 100,
    height: 10,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.5)",
    elevation: 12,
  },
  spoilerEdge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 140, 0, 0.3)",
  },
  rearSpoilerSide: {
    position: "absolute",
    top: 14,
    left: 62,
    width: 96,
    height: 7,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.4)",
    elevation: 10,
  },
  frontSplitter: {
    position: "absolute",
    bottom: 12,
    left: 35,
    width: 150,
    height: 6,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.5)",
    elevation: 8,
  },
  
  // WHEELS - M3 Performance wheels
  wheel: {
    position: "absolute",
    bottom: 6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: "#1a1a1a",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelFront: {
    left: 35,
  },
  wheelBack: {
    right: 35,
  },
  tire: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 19,
    backgroundColor: "#1a1a1a",
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  brakeDisk: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3a3a3a",
    borderWidth: 2,
    borderColor: "#555555",
  },
  brakeCaliper: {
    position: "absolute",
    width: 8,
    height: 14,
    backgroundColor: "#FFA500",
    borderRadius: 2,
    left: 6,
    top: 12,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#FF8C00",
  },
  m3Rim: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2a2a2a",
    borderWidth: 2,
    borderColor: "#888888",
    alignItems: "center",
    justifyContent: "center",
  },
  rimSpoke: {
    position: "absolute",
    width: 3,
    height: 20,
    backgroundColor: "#AAAAAA",
  },
  rimCenter: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3a3a3a",
    borderWidth: 1.5,
    borderColor: "#777777",
  },
  mBadgeWheel: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0066B3",
    borderWidth: 1,
    borderColor: "#FFFFFF",
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
  
  // AMBIENT GLOW - Need for Speed style
  ambientGlow: {
    position: "absolute",
    backgroundColor: "#FF8C00",
    opacity: 0.15,
    borderRadius: 200,
    transform: [{ scaleY: 0.3 }],
  },
});
