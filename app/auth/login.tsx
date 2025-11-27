import bcrypt from "bcryptjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleLogin = async () => {
    setError("");
    try {
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .is("deleted_at", null)
        .single();

      if (fetchError || !user) {
        setError("Email o contraseña incorrectos");
        return;
      }

      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        setError("Email o contraseña incorrectos");
        return;
      }

      router.replace({ pathname: "/main", params: { userId: user.id } });
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  // Animación fade del error
  const showError = () => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      }, 3000);
    });
  };

  if (error) showError();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          placeholder="Correo"
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#9ca3af"
        />

        {error ? (
          <Animated.Text style={[styles.errorText, { opacity: fadeAnim }]}>{error}</Animated.Text>
        ) : null}

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.buttonBlue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/register")} style={styles.registerWrap}>
          <Text style={styles.linkText}>No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.background} />
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
    fontSize: 32,
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
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonBlue: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  registerWrap: {
    marginTop: 5,
  },
  linkText: {
    color: "#facc15",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
  },
  background: {
    position: "absolute",
    top: -150,
    left: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#fbbf24",
    opacity: 0.1,
  },
});
