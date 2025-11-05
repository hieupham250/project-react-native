import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { RadioButton, TextInput } from "react-native-paper";
import { useState } from "react";

interface UserRegister {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  gender: string;
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<UserRegister>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<UserRegister & { confirmPassword: string }>
  >({});

  const handleChange = (name: keyof UserRegister, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d+$/.test(form.phone))
      newErrors.phone = "Phone must be a number";

    if (!form.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of birth is required";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (!form.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validate()) {
      Alert.alert("Success", "Registration successful!");
      router.replace("/login");
    } else {
      Alert.alert("Error", "Please fix the errors");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View>
        <TextInput
          label="Full Name"
          value={form.fullName}
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => handleChange("fullName", text)}
        />
        <TextInput
          label="Email"
          value={form.email}
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => handleChange("email", text)}
        />
        <TextInput
          label="Phone"
          value={form.phone}
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => handleChange("phone", text)}
        />
        <TextInput
          label="Date of Birth"
          value={form.dateOfBirth}
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => handleChange("dateOfBirth", text)}
        />
        <TextInput
          label="Password"
          value={form.password}
          mode="outlined"
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          mode="outlined"
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <Text style={{ marginVertical: 10, fontSize: 16 }}>Gender</Text>
        <RadioButton.Group
          onValueChange={(value) => handleChange("gender", value)}
          value={form.gender}
        >
          <View style={styles.radioRow}>
            <RadioButton value="Male" />
            <Text style={styles.radioLabel}>Male</Text>
          </View>
          <View style={styles.radioRow}>
            <RadioButton value="Female" />
            <Text style={styles.radioLabel}>Female</Text>
          </View>
        </RadioButton.Group>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng nhập</Text>
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
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30 },
  form: { width: "100%", marginBottom: 30 },
  input: { marginBottom: 15 },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "500" },
  link: { marginTop: 20, color: "#007AFF", fontSize: 16 },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  radioLabel: { fontSize: 16 },
});
