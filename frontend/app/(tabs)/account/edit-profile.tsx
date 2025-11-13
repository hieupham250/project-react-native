import { getUserDetail, register, updateProfile } from "@/apis/auth.api";
import { User } from "@/interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function EditProfile() {
  const router = useRouter();
  const [form, setForm] = useState<User>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
  });
  const [errors, setErrors] = useState<Partial<User>>({});
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserDetail(Number(userId)),
    enabled: !!userId,
  });

  useEffect(() => {
    console.log(profile);

    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "MALE",
      });
    }
  }, [profile]);

  const handleChange = (name: keyof User, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingUpdate(true);

      const res = await updateProfile({ ...form, userId });

      if (res.success) {
        Alert.alert("Cập nhật thành công", res.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const resData = error.response.data;

        if (resData.errors && resData.errors.length > 0) {
          const newErrors: typeof errors = {};
          resData.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in form) {
              newErrors[err.field as keyof User] = err.message;
            } else {
              Alert.alert("Error", err.message);
            }
          });
          setErrors(newErrors);
        } else {
          Alert.alert("Error", resData.message || "Cập nhật thất bại");
        }
      } else {
        Alert.alert("Error", error.message || "Cập nhật thất bại");
      }
    } finally {
      setIsLoadingUpdate(false);
    }
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Cập nhật thông tin</Text>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Full name"
              value={form.fullName}
              onChangeText={(text) => handleChange("fullName", text)}
            />
            {errors.fullName && (
              <Text style={styles.textError}>{errors.fullName}</Text>
            )}
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              value={form.email}
            />
            {errors.email && (
              <Text style={styles.textError}>{errors.email}</Text>
            )}
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Phone"
              keyboardType="numeric"
              value={form.phone}
              onChangeText={(text) => handleChange("phone", text)}
            />
            {errors.phone && (
              <Text style={styles.textError}>{errors.phone}</Text>
            )}
            <TextInput
              style={[styles.input, errors.dateOfBirth && styles.inputError]}
              placeholder="Date of Birth"
              value={form.dateOfBirth}
              onChangeText={(text) => handleChange("dateOfBirth", text)}
            />
            {errors.dateOfBirth && (
              <Text style={styles.textError}>{errors.dateOfBirth}</Text>
            )}
            <View style={styles.genderContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => handleChange("gender", "MALE")}
                >
                  <View
                    style={[
                      styles.radio,
                      form.gender === "MALE" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.genderText}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.genderOption}
                  onPress={() => handleChange("gender", "FEMALE")}
                >
                  <View
                    style={[
                      styles.radio,
                      form.gender === "FEMALE" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.genderText}>Female</Text>
                </TouchableOpacity>
              </View>
              {errors.gender && (
                <Text style={styles.textError}>{errors.gender}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoadingUpdate && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isLoadingUpdate}
          >
            {isLoadingUpdate ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cập nhật</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  container: {
    alignItems: "center",
  },
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 30 },
  form: {
    width: "100%",
    marginBottom: 30,
    display: "flex",
    gap: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputError: {
    borderColor: "red",
  },
  textError: {
    color: "red",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "500" },
  link: { marginTop: 20, color: "#007AFF", fontSize: 16 },
  genderContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  genderOptions: {
    flexDirection: "row",
    gap: 20,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  radioSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderText: {
    fontSize: 16,
  },
});
