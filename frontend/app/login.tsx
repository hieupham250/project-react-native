import { login } from "@/apis/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      if (res.success) {
        await AsyncStorage.setItem("accessToken", res.data.token);
        router.replace("/(tabs)");
      } else {
        const msg =
          res.errors?.[0]?.message || res.message || "Đăng nhập thất bại";
        Alert.alert("Đăng nhập thất bại", msg);
      }
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Đăng nhập thất bại", "Có lỗi xảy ra khi kết nối server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 30 },
  form: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "500" },
  link: { marginTop: 20, color: "#007AFF", fontSize: 16 },
});
