import { register } from "@/apis/auth.api";
import { UserRegister } from "@/interface";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<UserRegister>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "MALE",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<UserRegister & { confirmPassword: string }>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: keyof UserRegister, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);

      const res = await register(form);

      if (res.success) {
        Alert.alert("Thành công", res.message);
        router.push("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const resData = error.response.data;

        if (resData.errors && resData.errors.length > 0) {
          const newErrors: typeof errors = {};
          resData.errors.forEach((err: { field: string; message: string }) => {
            if (err.field in form) {
              newErrors[err.field as keyof UserRegister] = err.message;
            } else {
              Alert.alert("Error", err.message);
            }
          });
          setErrors(newErrors);
        } else {
          Alert.alert("Error", resData.message || "Đăng ký thất bại");
        }
      } else {
        Alert.alert("Error", error.message || "Đăng ký thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.title}>Register</Text>

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
              onChangeText={(text) => handleChange("email", text)}
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
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            {errors.password && (
              <Text style={styles.textError}>{errors.password}</Text>
            )}
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            {errors.confirmPassword && (
              <Text style={styles.textError}>{errors.confirmPassword}</Text>
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
            style={[styles.button, isLoading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
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
