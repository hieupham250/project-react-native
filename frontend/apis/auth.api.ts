import { UserRegister } from "@/interface";
import axiosInstance from "@/utils/axiosInstance";

export const register = async (data: UserRegister): Promise<any> => {
  try {
    const response = await axiosInstance.post("auth/register", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const login = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("auth/login", data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getUserDetail = async (userId: number): Promise<any> => {
  try {
    const response = await axiosInstance.get(`auth/me/${userId}`);
    return response.data?.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateProfile = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.put("auth/profile", data);
    return response.data?.data;
  } catch (error: any) {
    throw error;
  }
};
