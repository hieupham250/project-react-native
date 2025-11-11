import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/apis/review.api";
import { ReviewRequest } from "@/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WriteReviewScreen(): React.JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const roomId = Number(params.roomId as string) || 0;
  const roomType = params.roomType as string;
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: (data: ReviewRequest) => createReview(data),
    onSuccess: () => {
      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
      queryClient.invalidateQueries({ queryKey: ["reviews", roomId] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi đánh giá"
      );
    },
  });

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

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đánh giá của bạn");
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao từ 1 đến 5");
      return;
    }

    if (!userId) {
      Alert.alert(
        "Lỗi",
        "Không xác định được người dùng. Vui lòng đăng nhập lại!"
      );
      return;
    }
    setLoading(true);
    mutate(
      {
        roomId,
        userId,
        rating,
        comment,
      },
      {
        onSettled: () => setLoading(false),
      }
    );

    try {
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi đánh giá"
      );
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? "#FFB800" : "#6B7280"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={"#FFFFFF"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={"#1A1A1A"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={styles.backButton} />
      </View>

      {loadingReview ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={"#6C7CE7"} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Room Name */}
          {roomType && (
            <View style={styles.roomTypeContainer}>
              <Text style={styles.roomTypeText}>{roomType}</Text>
            </View>
          )}

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rating</Text>
            {renderStars()}
            <Text style={styles.ratingText}>{rating} out of 5 stars</Text>
          </View>

          {/* Comment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Review</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Hãy chia sẻ trải nghiệm của bạn về phòng này..."
              placeholderTextColor={"#6B7280"}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{comment.length} characters</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={"#FFFFFF"} />
            ) : (
              <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  commentInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#6B7280",
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
  },
  submitButton: {
    backgroundColor: "#6C7CE7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  roomTypeContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  roomTypeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 4,
  },
  editNote: {
    fontSize: 14,
    color: "#6C7CE7",
    fontStyle: "italic",
  },
});
