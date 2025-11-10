import { Room } from "@/interface";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RoomCardProps {
  room: Room;
  variant?: "horizontal" | "vertical";
  onPress?: () => void;
}

export const RoomCard = ({
  room,
  variant = "vertical",
  onPress,
}: RoomCardProps) => {
  const isHorizontal = variant === "horizontal";

  return (
    <TouchableOpacity
      style={[styles.card, isHorizontal && styles.cardHorizontal]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.imageContainer,
          isHorizontal && styles.imageContainerHorizontal,
        ]}
      >
        <ExpoImage
          source={{ uri: room.imageUrls[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={"#FFB800"} />
          <Text style={styles.ratingText}>{room.rating}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.roomType} numberOfLines={1}>
          {room.roomType}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={"#6B7280"} />
          <Text style={styles.location} numberOfLines={1}>
            {room.address}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.reviews}>({room.rating} Reviews)</Text>
          <Text style={styles.price}>${room.price}/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHorizontal: {
    width: 300,
    marginRight: 20,
    marginBottom: 0,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  imageContainerHorizontal: {
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  content: {
    padding: 16,
  },
  roomType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
    fontWeight: "400",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  reviews: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "400",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6C7CE7",
    letterSpacing: -0.3,
  },
});
