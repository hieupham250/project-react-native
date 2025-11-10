import { Room } from "@/interface";
import axiosInstance from "@/utils/axiosInstance";

export const getRooms = async (): Promise<Room[]> => {
  try {
    const response = await axiosInstance.get("rooms");
    if (response.data.success && response.data?.data) {
      return response.data?.data;
    } else {
      return [];
    }
  } catch (error: any) {
    console.error("Get all rooms error:", error);
    throw error;
  }
};

export const getRoomsByHotelId = async (hotelId: number): Promise<Room[]> => {
  try {
    const response = await axiosInstance.get(`rooms/hotel/${hotelId}`);
    return response.data?.data;
  } catch (error: any) {
    console.error("Get rooms by hotelId error:", error);
    throw error;
  }
};

export const searchRooms = async (keyword?: string): Promise<Room[]> => {
  try {
    const params: any = {};
    if (keyword) params.keyword = keyword;

    const response = await axiosInstance.get("rooms/search", { params });
    return response.data?.data;
  } catch (error: any) {
    console.error("Search rooms error:", error);
    throw error;
  }
};

export const getRoomById = async (roomId: number): Promise<Room> => {
  try {
    const response = await axiosInstance.get(`rooms/${roomId}`);
    return response.data?.data;
  } catch (error: any) {
    console.error("Get room by id error:", error);
    throw error;
  }
};
