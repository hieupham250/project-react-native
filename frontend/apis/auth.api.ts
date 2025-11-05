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
