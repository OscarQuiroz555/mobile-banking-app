import bcrypt from "bcryptjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpacity] = useState(new Animated.Value(0));

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      }, 2500);
    });
  };

  const handleRegister = async () => {
    setError("");
    if (!firstName || !lastName || !email || !password) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (existingUser) {
        setError("El correo ya está registrado");
        setLoading(false);
        return;
      }

      const hashedPassword = bcrypt.hashSync(password.trim(), 10);

      const { data, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            phone,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            status: "active",
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      showToast(`¡Bienvenido ${data.first_name}! Cuenta creada exitosamente.`);
      setTimeout(() => router.replace("/auth/login"), 2800);
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Regístrate para continuar</Text>

        <TextInput placeholder="Nombre" onChangeText={setFirstName} style={styles.input} placeholderTextColor="#94a3b8" />
        <TextInput placeholder="Apellido" onChangeText={setLastName} style={styles.input} placeholderTextColor="#94a3b8" />
        <TextInput placeholder="Celular" onChangeText={setPhone} style={styles.input} placeholderTextColor="#94a3b8" />
        <TextInput
          placeholder="Correo"
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.buttonGreen, loading && styles.buttonDisabled]}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Registrarse</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")} style={styles.registerWrap}>
          <Text style={styles.linkText}>Volver a Login</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {toastMessage ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      ) : null}

      {/* Background decorativo */}
      <View style={styles.backgroundCircle} />
      <View style={styles.backgroundCircle2} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fef3c7",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e2e8f0",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#334155",
    color: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonGreen: {
    backgroundColor: "#10b981",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: { backgroundColor: "#6ee7b7" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 18, textAlign: "center" },
  registerWrap: { marginTop: 5 },
  linkText: { color: "#facc15", textAlign: "center", fontWeight: "600", fontSize: 15 },
  toast: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: { color: "#fff", fontWeight: "700" },
  backgroundCircle: {
    position: "absolute",
    top: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#fbbf24",
    opacity: 0.1,
  },
  backgroundCircle2: {
    position: "absolute",
    bottom: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#3b82f6",
    opacity: 0.08,
  },
});
