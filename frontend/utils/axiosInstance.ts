import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

const BASE_URL =
  Platform.OS === "android"
    ? "http://192.168.1.242:8080/api/v1/"
    : "http://localhost:8080/api/v1/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Không thể lấy token:", err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token hết hạn hoặc không hợp lệ
      await AsyncStorage.multiRemove(["accessToken", "userProfile"]);
      Alert.alert(
        "Phiên đăng nhập hết hạn",
        "Vui lòng đăng nhập lại để tiếp tục."
      );
    } else if (status >= 400 && status < 500) {
      Alert.alert(
        "Lỗi yêu cầu",
        error?.response?.data?.message || "Có lỗi xảy ra!"
      );
    } else if (status >= 500) {
      Alert.alert("Lỗi hệ thống", "Máy chủ đang gặp sự cố, thử lại sau.");
    } else if (!error?.response) {
      Alert.alert("Không thể kết nối đến máy chủ!");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
