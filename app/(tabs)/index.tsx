import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const MapScreen = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const areas = [
    {
      id: "mainStage",
      x: 80,
      y: 20,
      width: 160,
      height: 100,
      info: "Main Stage",
    },
    { id: "cafe", x: 10, y: 130, width: 130, height: 60, info: "Cafe" },
    {
      id: "breakoutStage",
      x: 20,
      y: 210,
      width: 120,
      height: 70,
      info: "Breakout Stage",
    },
    { id: "bar", x: 170, y: 130, width: 80, height: 60, info: "Bar" },
    { id: "exit", x: 220, y: 20, width: 40, height: 30, info: "Exit" },
    { id: "exit2", x: 220, y: 20, width: 40, height: 30, info: "Exit" },
    { id: "exit3", x: 220, y: 20, width: 40, height: 30, info: "Exit" },
  ];

  const handleAreaPress = (area: { info: string }) => {
    setSelectedArea(area.info);
  };

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    scale.value = withTiming(e.scale);
  });

  const panGesture = Gesture.Pan().onUpdate((e) => {
    translateX.value = withTiming(e.translationX);
    translateY.value = withTiming(e.translationY);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleZoomIn = () => {
    scale.value = withTiming(scale.value * 1.2);
  };

  const handleZoomOut = () => {
    scale.value = withTiming(scale.value / 1.2);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Map Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AntDesign name="checkcircle" size={24} color="skyblue" />
            <Text style={styles.savedText}>Saved</Text>
          </View>
          <Text style={styles.headerText}>Map</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView contentContainerStyle={styles.mapContainer}>
          {/* Interactive Map Container with Border */}
          <GestureDetector
            gesture={Gesture.Simultaneous(pinchGesture, panGesture)}
          >
            <Animated.View style={[styles.svgWrapper, animatedStyle]}>
              <Svg height="700" width="370">
                {areas.map((area) => (
                  <Rect
                    key={area.id}
                    x={area.x}
                    y={area.y}
                    width={area.width}
                    height={area.height}
                    fill="transparent"
                    stroke="gray"
                    onPress={() => handleAreaPress(area)}
                  />
                ))}
              </Svg>
            </Animated.View>
          </GestureDetector>
        </ScrollView>

        {/* Zoom Buttons */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Modal to show area information */}
        <Modal
          isVisible={!!selectedArea}
          onBackdropPress={() => setSelectedArea(null)}
        >
          <View style={styles.modalContent}>
            <Text>{selectedArea}</Text>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedText: {
    marginLeft: 5,
    fontSize: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 24,
  },
  mapContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  svgWrapper: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  zoomControls: {
    position: "absolute",
    bottom: 50,
    right: 20,
    flexDirection: "column",
  },
  zoomButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Add some shadow for Android
    shadowColor: "#000", // Add some shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default MapScreen;
