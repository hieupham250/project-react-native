import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Room } from "@/interface";
import { getRoomById } from "@/apis/room.api";
import { useQuery } from "@tanstack/react-query";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 24) / 2;

export default function PhotoGallery() {
  const { id, roomId } = useLocalSearchParams<{
    id?: string;
    roomId?: string;
  }>();
  const realId = id ?? roomId;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    data: room,
    isLoading,
    isError,
    refetch,
  } = useQuery<Room>({
    queryKey: ["room", realId],
    queryFn: () => getRoomById(Number(realId)),
    enabled: !!realId,
    retry: 1,
  });

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Đang tải ảnh...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !room) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Lỗi khi tải dữ liệu phòng.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={"#6B7280"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tất cả hình ảnh</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Image Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {room.imageUrls?.map((url: any, index: any) => (
          <Animated.View
            key={index}
            style={[styles.imageWrapper, animatedStyle]}
          >
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => setSelectedImage(url)}
              activeOpacity={0.9}
            >
              <ExpoImage
                source={{ uri: url }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <ExpoImage
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  imageWrapper: {
    marginBottom: 8,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 101,
  },
});
