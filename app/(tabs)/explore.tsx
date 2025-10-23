import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { CubeType } from "@/utils/scrambleGenerator";

export default function TabTwoScreen() {
  const [selectedCube, setSelectedCube] = useState<CubeType>("3x3");
  const [colorTheme, setColorTheme] = useState("default");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Charger le thème de couleur
  useEffect(() => {
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
  }, []);

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

  const cubeTypes: {
    type: CubeType;
    name: string;
    icon: string;
    image: any;
  }[] = [
    {
      type: "2x2",
      name: "2x2x2",
      icon: "square.grid.2x2",
      image: require("@/assets/images/cubes/2x2.png"),
    },
    {
      type: "3x3",
      name: "3x3x3",
      icon: "square.grid.3x3",
      image: require("@/assets/images/cubes/3x3.png"),
    },
    {
      type: "4x4",
      name: "4x4x4",
      icon: "square.grid.3x3",
      image: require("@/assets/images/cubes/4x4.png"),
    },
    {
      type: "pyraminx",
      name: "Pyraminx",
      icon: "triangle",
      image: require("@/assets/images/cubes/pyraminx.png"),
    },
    {
      type: "skewb",
      name: "Skewb",
      icon: "diamond",
      image: require("@/assets/images/cubes/skewb.png"),
    },
    {
      type: "clock",
      name: "Clock",
      icon: "clock",
      image: require("@/assets/images/cubes/clock.png"),
    },
    {
      type: "square1",
      name: "Square-1",
      icon: "square",
      image: require("@/assets/images/cubes/square1.png"),
    },
    {
      type: "blindfold",
      name: "3BLD",
      icon: "eye.slash",
      image: require("@/assets/images/cubes/3x3.png"),
    },
  ];

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#fff", marginTop: 45 },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Choisir le cube
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: isDark ? "#888" : "#666" }]}
          >
            Sélectionne le type de cube pour le duel
          </ThemedText>
        </View>

        <View style={styles.cubeGrid}>
          {cubeTypes.map((cube) => (
            <TouchableOpacity
              key={cube.type}
              onPress={() => {
                setSelectedCube(cube.type);
                // Naviguer vers Battle avec le cube sélectionné
                router.push({
                  pathname: "/(tabs)",
                  params: { cubeType: cube.type },
                });
              }}
              style={[
                styles.cubeCard,
                {
                  backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
                  borderColor:
                    selectedCube === cube.type
                      ? getThemeColor()
                      : isDark
                      ? "#333"
                      : "#ddd",
                },
              ]}
            >
              {cube.image && (
                <Image
                  source={cube.image}
                  style={styles.cubeImage}
                  resizeMode="contain"
                />
              )}
              <ThemedText
                style={[
                  styles.cubeName,
                  {
                    color:
                      selectedCube === cube.type
                        ? getThemeColor()
                        : isDark
                        ? "#fff"
                        : "#000",
                  },
                ]}
              >
                {cube.name}
              </ThemedText>
              {selectedCube === cube.type && (
                <View
                  style={[
                    styles.selectedIndicator,
                    { backgroundColor: getThemeColor() },
                  ]}
                >
                  <IconSymbol name="checkmark" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <ThemedText
            style={[styles.selectedText, { color: isDark ? "#888" : "#666" }]}
          >
            Cube sélectionné:{" "}
            {cubeTypes.find((c) => c.type === selectedCube)?.name}
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  cubeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  cubeCard: {
    width: "45%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cubeImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  cubeName: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  selectedText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  adContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});
