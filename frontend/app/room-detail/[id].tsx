import { getReviewsByRoomId } from "@/apis/review.api";
import { getRoomById } from "@/apis/room.api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import ExpoImage from "expo-image/build/ExpoImage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RoomDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [userId, setUserId] = React.useState<number | null>(null);

  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hotel-detail", id],
    queryFn: () => getRoomById(Number(id)),
    enabled: !!id,
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    isError: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getReviewsByRoomId(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={"#6C7CE7"} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Không tìm thấy khách sạn</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    const loadUserId = async () => {
      const storedId = await AsyncStorage.getItem("userId");
      if (storedId) {
        setUserId(Number(storedId));
      } else {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!"
        );
        router.replace("/login");
      }
    };

    loadUserId();
  }, []);

  const hasReviewed = React.useMemo(() => {
    if (!reviews || !userId) return false;
    return reviews.some((review: any) => review.userId === userId);
  }, [reviews, userId]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerButton, styles.headerButtonTransparent]}
        >
          <Ionicons name="arrow-back" size={24} color={"#FFFFFF"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Main Image */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (room?.imageUrls && room.imageUrls.length > 0) {
              router.push({
                pathname: "/room-photo/[id]",
                params: { id },
              });
            }
          }}
        >
          <View style={[styles.imageContainer, { width }]}>
            <Image
              source={{
                uri:
                  room?.imageUrls && room.imageUrls.length > 0
                    ? room.imageUrls[0]
                    : "https://via.placeholder.com/400x200?text=No+Image",
              }}
              style={styles.mainImage}
              contentFit="cover"
              transition={200}
            />
            {room?.imageUrls && room.imageUrls.length > 0 && (
              <View style={styles.imageOverlay}>
                <View style={styles.imageOverlayContent}>
                  <Ionicons name="images-outline" size={20} color={"#FFFFFF"} />
                  <Text style={styles.imageCountText}>
                    {room.imageUrls.length} ảnh
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Room Info */}
        <View style={styles.content}>
          <Text style={styles.roomName}>{room?.roomType}</Text>

          {/* Rating */}
          {room?.rating && room.rating > 0 && (
            <View style={styles.ratingRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={
                    i < Math.floor(room.rating || 0) ? "star" : "star-outline"
                  }
                  size={16}
                  color={"#FFB800"}
                />
              ))}
              <Text style={styles.ratingText}>
                {room.rating.toFixed(1)} ({room.reviewCount || 0} Reviews)
              </Text>
            </View>
          )}

          <View style={styles.locationRow}>
            <Ionicons name="business-outline" size={16} color={"#6B7280"} />
            <Text style={styles.location}>
              {room?.hotelName || "Thuộc khách sạn không xác định"}
            </Text>
          </View>

          {/* Description */}
          {room?.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mô tả</Text>
              <Text style={styles.overviewText}>{room.description}</Text>
            </View>
          )}

          {/* Photos */}
          {room?.imageUrls && room.imageUrls.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Hình ảnh</Text>
              </View>
              <FlatList
                data={room.imageUrls}
                renderItem={({ item }) => (
                  <View style={styles.photoThumbnail}>
                    <Image
                      source={{ uri: item }}
                      style={styles.photoImage}
                      contentFit="cover"
                    />
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photosList}
              />
            </View>
          )}

          {/* Room Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi tiết phòng</Text>
            <Text style={styles.featureText}>
              Sức chứa: {room?.capacity} người
            </Text>

            {userId && !hasReviewed && (
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  router.push({
                    pathname: "/booking/write-review",
                    params: {
                      roomId: room?.roomId?.toString() || id,
                      roomType: room?.roomType || "Phòng chưa xác định",
                    },
                  })
                }
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text style={styles.reviewButtonText}>Viết đánh giá</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Reviews Section */}
          {reviews && reviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Đánh giá ({reviews.length})
              </Text>
              {reviews.slice(0, 5).map((review: any) => (
                <View key={review.reviewId} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUserName}>
                        {review.userName}
                      </Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? "star" : "star-outline"}
                            size={12}
                            color={"#FFB800"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.priceContainer}>
          {room?.price && room.price > 0 ? (
            <>
              <Text style={styles.priceLabel}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(room.price)}
              </Text>
              <Text style={styles.priceSubLabel}>/đêm</Text>
            </>
          ) : (
            <Text style={styles.priceLabel}>Liên hệ để biết giá</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.selectDateButton}
          onPress={() => {
            // router.push({
            //   pathname: "/booking/select-guest",
            //   params: {
            //     roomId: id,
            //     roomName: room?.roomType,
            //     roomPrice: room?.price?.toString() || "0",
            //   },
            // });
          }}
        >
          <Text style={styles.selectDateText}>Đặt phòng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButtonTransparent: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
  },

  scrollView: { flex: 1 },
  imageContainer: { height: 300 },
  mainImage: { width: "100%", height: "100%" },
  imageOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  imageOverlayContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  imageCountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  content: { padding: 16 },
  roomName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 24,
  },
  location: { fontSize: 16, color: "#6B7280" },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  photosList: { gap: 12 },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImage: { width: "100%", height: "100%" },
  featureText: {
    fontSize: 16,
    color: "#1A1A1A",
    lineHeight: 24,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  reviewComment: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  viewAllReviews: {
    paddingVertical: 12,
    alignItems: "center",
  },
  viewAllReviewsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C7CE7",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  priceContainer: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  priceLabel: { fontSize: 20, fontWeight: "700", color: "#6C7CE7" },
  priceSubLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  selectDateButton: {
    backgroundColor: "#6C7CE7",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  selectDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: "#6C7CE7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C7CE7",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  reviewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
