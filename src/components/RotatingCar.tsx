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
  withSequence,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

interface RotatingCarProps {
  size?: number;
}

export default function RotatingCar({ size = 260 }: RotatingCarProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const bobbing = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const isAutoRotating = useSharedValue(true);

  useEffect(() => {
    startAutoRotation();

    // Gentle breathing/bobbing animation
    bobbing.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Scale pulse
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

  const robotAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotation.value}deg` },
        { translateY: bobbing.value },
        { scale: scale.value },
      ],
    };
  });

  // Animate visibility based on rotation
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 45, 90, 180, 270, 315, 360],
      [1, 0.9, 0.6, 0.3, 0.6, 0.9, 1]
    );
    return { opacity };
  });

  const sideAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 45, 90, 135, 180, 270, 360],
      [0.3, 0.7, 1, 0.9, 0.5, 0.3, 0.3]
    );
    const translateX = interpolate(
      normalizedRotation,
      [0, 90, 180, 270, 360],
      [0, 20, 0, -20, 0]
    );
    return { opacity, transform: [{ translateX }] };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const normalizedRotation = ((rotation.value % 360) + 360) % 360;
    const opacity = interpolate(
      normalizedRotation,
      [0, 90, 135, 180, 225, 270, 360],
      [0.3, 0.5, 0.8, 1, 0.8, 0.5, 0.3]
    );
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Outer glow */}
        <View style={[styles.glow, { width: size * 1.2, height: size * 1.2 }]} />
        
        <Animated.View style={[styles.robotContainer, robotAnimatedStyle]}>
          
          {/* BACK VIEW */}
          <Animated.View style={[styles.robotLayer, backAnimatedStyle]}>
            <View style={styles.robot}>
              {/* Back of head */}
              <View style={[styles.head, styles.headBack]}>
                <LinearGradient
                  colors={["#4a4a4a", "#2a2a2a", "#1a1a1a"]}
                  style={styles.gradient}
                />
                {/* Back panel details */}
                <View style={styles.backPanel} />
              </View>
              
              {/* Body back */}
              <View style={[styles.body, styles.bodyBack]}>
                <LinearGradient
                  colors={["#5a5a5a", "#3a3a3a", "#2a2a2a"]}
                  style={styles.gradient}
                />
              </View>
            </View>
          </Animated.View>

          {/* SIDE VIEW */}
          <Animated.View style={[styles.robotLayer, sideAnimatedStyle]}>
            <View style={styles.robot}>
              {/* Head side */}
              <View style={[styles.head, styles.headSide]}>
                <LinearGradient
                  colors={["#D4AF37", "#E8C055", "#D4AF37"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Ear/sensor */}
                <View style={styles.sensor} />
              </View>
              
              {/* Body side */}
              <View style={[styles.body, styles.bodySide]}>
                <LinearGradient
                  colors={["#E89A3C", "#D4822C", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                {/* Side panel */}
                <View style={styles.sidePanel}>
                  <View style={styles.panelLine} />
                  <View style={[styles.panelLine, { top: 8 }]} />
                </View>
                {/* Arm joint */}
                <View style={styles.armJoint} />
              </View>
              
              {/* Arm */}
              <View style={styles.arm}>
                <LinearGradient
                  colors={["#C67B2E", "#A66A28"]}
                  style={styles.gradient}
                />
                <View style={styles.armSegment} />
              </View>
              
              {/* Leg */}
              <View style={styles.leg}>
                <LinearGradient
                  colors={["#B8960F", "#8B7B2F"]}
                  style={styles.gradient}
                />
                <View style={styles.legJoint} />
              </View>
            </View>
          </Animated.View>

          {/* FRONT VIEW */}
          <Animated.View style={[styles.robotLayer, frontAnimatedStyle]}>
            <View style={styles.robot}>
              {/* Head - golden metallic */}
              <View style={[styles.head, styles.headFront]}>
                <LinearGradient
                  colors={["#FFD580", "#E8C055", "#D4AF37", "#E8C055"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Visor/Eyes - glowing blue */}
                <View style={styles.visor}>
                  <LinearGradient
                    colors={["#4da6ff", "#0066cc", "#004d99"]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  {/* Eye lights */}
                  <View style={[styles.eyeLight, { left: 8 }]} />
                  <View style={[styles.eyeLight, { right: 8 }]} />
                </View>
                
                {/* Antenna */}
                <View style={styles.antenna}>
                  <View style={styles.antennaLight} />
                </View>
                
                {/* Face details */}
                <View style={styles.facePanel} />
              </View>
              
              {/* Neck joint */}
              <View style={styles.neck}>
                <LinearGradient
                  colors={["#666666", "#444444"]}
                  style={styles.gradient}
                />
              </View>
              
              {/* Body - orange metallic */}
              <View style={[styles.body, styles.bodyFront]}>
                <LinearGradient
                  colors={["#FFB347", "#E89A3C", "#D4822C", "#E89A3C"]}
                  style={styles.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Chest panel with logo */}
                <View style={styles.chestPanel}>
                  <View style={styles.coreLightOuter}>
                    <View style={styles.coreLight} />
                  </View>
                  {/* Panel lines */}
                  <View style={styles.chestLine} />
                  <View style={[styles.chestLine, { top: 25 }]} />
                </View>
                
                {/* Shoulder pads */}
                <View style={[styles.shoulder, { left: -5 }]}>
                  <LinearGradient
                    colors={["#C67B2E", "#A66A28"]}
                    style={styles.gradient}
                  />
                </View>
                <View style={[styles.shoulder, { right: -5 }]}>
                  <LinearGradient
                    colors={["#C67B2E", "#A66A28"]}
                    style={styles.gradient}
                  />
                </View>
              </View>
              
              {/* Arms with joints */}
              <View style={[styles.armFront, { left: -15 }]}>
                <LinearGradient
                  colors={["#D4822C", "#B86F25"]}
                  style={styles.gradient}
                />
                <View style={styles.armBand} />
                {/* Hand/Tool */}
                <View style={styles.hand}>
                  <LinearGradient
                    colors={["#8B6B3A", "#6B5330"]}
                    style={styles.gradient}
                  />
                  <View style={styles.finger} />
                </View>
              </View>
              
              <View style={[styles.armFront, { right: -15 }]}>
                <LinearGradient
                  colors={["#D4822C", "#B86F25"]}
                  style={styles.gradient}
                />
                <View style={styles.armBand} />
                <View style={styles.hand}>
                  <LinearGradient
                    colors={["#8B6B3A", "#6B5330"]}
                    style={styles.gradient}
                  />
                  <View style={styles.finger} />
                </View>
              </View>
              
              {/* Legs */}
              <View style={[styles.legFront, { left: 12 }]}>
                <LinearGradient
                  colors={["#C6A052", "#B8960F"]}
                  style={styles.gradient}
                />
                <View style={styles.kneeJoint} />
                {/* Foot */}
                <View style={styles.foot}>
                  <LinearGradient
                    colors={["#4a4a4a", "#2a2a2a"]}
                    style={styles.gradient}
                  />
                </View>
              </View>
              
              <View style={[styles.legFront, { right: 12 }]}>
                <LinearGradient
                  colors={["#C6A052", "#B8960F"]}
                  style={styles.gradient}
                />
                <View style={styles.kneeJoint} />
                <View style={styles.foot}>
                  <LinearGradient
                    colors={["#4a4a4a", "#2a2a2a"]}
                    style={styles.gradient}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
          
        </Animated.View>

        {/* Shadow */}
        <View style={[styles.shadow, { width: size * 0.4, top: size * 0.8 }]} />
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
  glow: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "#E89A3C",
    opacity: 0.12,
    shadowColor: "#E89A3C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
  },
  robotContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  robotLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  robot: {
    width: 140,
    height: 180,
    position: "relative",
    alignItems: "center",
  },
  
  // HEAD
  head: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    position: "relative",
  },
  headFront: {
    elevation: 10,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 2.5,
  },
  headSide: {
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  headBack: {
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  visor: {
    position: "absolute",
    top: 15,
    left: 8,
    width: 34,
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#0066cc",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 102, 204, 0.6)",
  },
  eyeLight: {
    position: "absolute",
    top: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#66d9ff",
    shadowColor: "#66d9ff",
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  antenna: {
    position: "absolute",
    top: -8,
    left: 20,
    width: 3,
    height: 10,
    backgroundColor: "#666666",
    borderRadius: 1.5,
  },
  antennaLight: {
    position: "absolute",
    top: -4,
    left: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#ff3333",
    shadowColor: "#ff3333",
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  facePanel: {
    position: "absolute",
    bottom: 8,
    left: 12,
    width: 26,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 2,
  },
  sensor: {
    position: "absolute",
    right: -3,
    top: 18,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4da6ff",
    borderWidth: 1,
    borderColor: "#0066cc",
  },
  backPanel: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 26,
    height: 26,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  
  // NECK
  neck: {
    width: 20,
    height: 12,
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#333333",
  },
  
  // BODY
  body: {
    width: 70,
    height: 75,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    position: "relative",
  },
  bodyFront: {
    elevation: 8,
    borderColor: "rgba(255, 255, 255, 0.35)",
    borderWidth: 2.5,
  },
  bodySide: {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  bodyBack: {
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  chestPanel: {
    position: "absolute",
    top: 12,
    left: 15,
    width: 40,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  coreLightOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 102, 204, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0066cc",
  },
  coreLight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4da6ff",
    shadowColor: "#4da6ff",
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  chestLine: {
    position: "absolute",
    width: 34,
    height: 1.5,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    top: 35,
  },
  shoulder: {
    position: "absolute",
    top: 5,
    width: 22,
    height: 18,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(150, 100, 50, 0.4)",
  },
  sidePanel: {
    position: "absolute",
    left: 8,
    top: 15,
    width: 30,
    height: 45,
  },
  panelLine: {
    position: "absolute",
    width: 28,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    top: 4,
  },
  armJoint: {
    position: "absolute",
    left: -4,
    top: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#666666",
    borderWidth: 2,
    borderColor: "#888888",
  },
  
  // ARMS
  arm: {
    position: "absolute",
    left: -18,
    top: 75,
    width: 14,
    height: 42,
    borderRadius: 7,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(150, 100, 50, 0.3)",
  },
  armSegment: {
    position: "absolute",
    top: 18,
    left: 2,
    width: 10,
    height: 3,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 1.5,
  },
  armFront: {
    position: "absolute",
    top: 75,
    width: 16,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(180, 110, 40, 0.4)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  armBand: {
    position: "absolute",
    top: 22,
    width: "100%",
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.3)",
  },
  hand: {
    position: "absolute",
    bottom: -14,
    left: 2,
    width: 12,
    height: 16,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(100, 80, 50, 0.4)",
  },
  finger: {
    position: "absolute",
    bottom: -3,
    left: 3,
    width: 6,
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 1,
  },
  
  // LEGS
  leg: {
    position: "absolute",
    left: 15,
    top: 140,
    width: 16,
    height: 35,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(180, 150, 30, 0.3)",
  },
  legJoint: {
    position: "absolute",
    top: 16,
    left: 2,
    width: 12,
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(100, 100, 100, 0.2)",
  },
  legFront: {
    position: "absolute",
    top: 135,
    width: 18,
    height: 38,
    borderRadius: 9,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(200, 160, 80, 0.4)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  kneeJoint: {
    position: "absolute",
    top: 18,
    left: 3,
    width: 12,
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(120, 120, 120, 0.3)",
  },
  foot: {
    position: "absolute",
    bottom: -8,
    left: -2,
    width: 22,
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(80, 80, 80, 0.4)",
  },
  
  gradient: {
    flex: 1,
  },
  
  shadow: {
    position: "absolute",
    height: 12,
    backgroundColor: "#000000",
    opacity: 0.4,
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
