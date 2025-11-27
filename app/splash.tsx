import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{ color: "#fff", marginTop: 20, fontSize: 20, fontWeight: "700" }}>
        Cargando...
      </Text>
    </View>
  );
}
