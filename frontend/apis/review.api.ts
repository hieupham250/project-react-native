import { Review, ReviewRequest } from "@/interface";
import axiosInstance from "@/utils/axiosInstance";

export const createReview = async (data: ReviewRequest): Promise<Review> => {
  const response = await axiosInstance.post("reviews", data);
  return response.data.data;
};

export const getReviewsByRoomId = async (roomId: number): Promise<Review[]> => {
  try {
    const response = await axiosInstance.get(`reviews/room/${roomId}`);
    if (response.data.success && response.data?.data) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Get all review by roomId error:", error);
    throw error;
  }
};
