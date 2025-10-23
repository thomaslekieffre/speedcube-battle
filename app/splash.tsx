import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const [colorTheme, setColorTheme] = useState("default");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Fonction pour obtenir la couleur du thème
  const getThemeColor = () => {
    const themes = {
      default: "#4CAF50",
      blue: "#2196F3",
      purple: "#9C27B0",
      orange: "#FF9800",
      red: "#F44336",
      pink: "#E91E63",
    };
    return themes[colorTheme as keyof typeof themes] || "#4CAF50";
  };

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Charger le thème de couleur
    const loadColorTheme = async () => {
      try {
        const colorThemeSaved = await AsyncStorage.getItem("colorTheme");
        if (colorThemeSaved !== null) {
          setColorTheme(JSON.parse(colorThemeSaved));
        }
      } catch (error) {
        console.log("Error loading colorTheme:", error);
      }
    };
    loadColorTheme();

    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigation vers l'app après 2.5 secondes
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <ThemedText
          type="title"
          style={[styles.title, { color: getThemeColor() }]}
        >
          Speedcube Battle
        </ThemedText>

        <View style={styles.subtitleContainer}>
          <ThemedText
            style={[styles.subtitle, { color: isDark ? "#888" : "#666" }]}
          >
            By DrPepper
          </ThemedText>
          <ThemedText
            style={[styles.studio, { color: isDark ? "#888" : "#666" }]}
          >
            Speedcube Master Studio
          </ThemedText>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  studio: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
