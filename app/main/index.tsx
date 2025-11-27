import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { 
  StyleSheet, Text, TouchableOpacity, View, ScrollView, Animated 
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Main() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadUser = async () => {
      if (!params.userId) return router.replace("/auth/login");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(params.userId))
        .single();
      if (error || !data) return router.replace("/auth/login");
      setUser(data);
    };

    const loadUsersList = async () => {
      const { data } = await supabase.from("users").select("id, first_name, last_name, email");
      if (data) setUsersList(data);
    };

    loadUser();
    loadUsersList();

    // Animación de fade-in
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [params.userId]);

  const handleLogout = () => router.replace("/auth/login");

  return (
    <View style={styles.container}>
      {/* Fondo con burbujas y gradientes */}
      <View style={styles.backgroundBubble1} />
      <View style={styles.backgroundBubble2} />
      <View style={styles.backgroundGradient} />

      {user ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
            <Text style={styles.greeting}>Hola, {user.first_name} 👋</Text>
            <Text style={styles.subtitle}>Bienvenido al dashboard</Text>

            {/* Tarjeta de usuarios registrados */}
            <View style={styles.dashboard}>
              <Animated.View style={styles.card}>
                <Text style={styles.cardTitle}>Usuarios registrados</Text>
                {usersList.length > 0 ? (
                  usersList.slice(0, 5).map((u, idx) => (
                    <Text key={u.id} style={styles.userItem}>
                      {idx + 1}. {u.first_name} {u.last_name} - {u.email}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.userItem}>Cargando...</Text>
                )}
              </Animated.View>

              {/* Gráfico de barras animado */}
              <Animated.View style={styles.card}>
                <Text style={styles.cardTitle}>Actividad semanal</Text>
                <View style={styles.barChart}>
                  {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.6].map((value, index) => (
                    <Animated.View
                      key={index}
                      style={[styles.bar, { 
                        height: `${value * 100}%`, 
                        backgroundColor: `rgba(59,130,246,${0.5 + value / 2})`
                      }]}
                    />
                  ))}
                </View>
              </Animated.View>

              {/* Gráfico circular con efecto flotante */}
              <Animated.View style={styles.card}>
                <Text style={styles.cardTitle}>Distribución usuarios</Text>
                <View style={styles.circleContainer}>
                  <View style={[styles.circleSegment, { backgroundColor: "#10b981", width: 60, height: 60 }]} />
                  <View style={[styles.circleSegment, { backgroundColor: "#f59e0b", width: 40, height: 40 }]} />
                  <View style={[styles.circleSegment, { backgroundColor: "#ef4444", width: 30, height: 30 }]} />
                </View>
              </Animated.View>
            </View>

            {/* Botón de logout */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      ) : (
        <Text style={styles.loading}>Cargando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  scrollContainer: { padding: 20, alignItems: "center" },

  greeting: { fontSize: 28, fontWeight: "700", color: "#fef3c7", marginBottom: 5, textAlign: "center" },
  subtitle: { fontSize: 16, fontWeight: "500", color: "#e2e8f0", marginBottom: 20, textAlign: "center" },

  dashboard: { width: "100%" },

  card: {
    backgroundColor: "#1e293b",
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fef3c7", marginBottom: 15 },
  userItem: { color: "#e2e8f0", fontSize: 14, marginBottom: 8 },

  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    marginTop: 10,
  },
  bar: { width: 20, borderRadius: 5 },

  circleContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 15 },
  circleSegment: { borderRadius: 100, transform: [{ translateY: -5 }] },

  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 18,
    borderRadius: 15,
    marginBottom: 30,
    width: "100%",
    shadowColor: "#b91c1c",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  loading: { fontSize: 18, fontWeight: "500", color: "#fef3c7", textAlign: "center", marginTop: 50 },

  backgroundBubble1: {
    position: "absolute",
    top: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#fbbf24",
    opacity: 0.08,
  },
  backgroundBubble2: {
    position: "absolute",
    bottom: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#3b82f6",
    opacity: 0.06,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "linear-gradient(135deg, #1e293b, #0f172a)",
    opacity: 0.05,
  },
});
