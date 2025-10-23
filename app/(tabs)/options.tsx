import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

export default function OptionsScreen() {
  const [fullBlack, setFullBlack] = useState(false);
  const [nonCuber, setNonCuber] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [colorTheme, setColorTheme] = useState("default");
  const [blindMode, setBlindMode] = useState(false);
  const [boMode, setBoMode] = useState(false);
  const [boRounds, setBoRounds] = useState(3);
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

  // Thèmes de couleur disponibles
  const colorThemes = [
    { id: "default", name: "Défaut", primary: "#4CAF50", secondary: "#2E7D32" },
    { id: "blue", name: "Bleu", primary: "#2196F3", secondary: "#1565C0" },
    { id: "purple", name: "Violet", primary: "#9C27B0", secondary: "#6A1B9A" },
    { id: "orange", name: "Orange", primary: "#FF9800", secondary: "#E65100" },
    { id: "red", name: "Rouge", primary: "#F44336", secondary: "#C62828" },
    { id: "pink", name: "Rose", primary: "#E91E63", secondary: "#AD1457" },
  ];

  // Charger les options au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const fullBlackSaved = await AsyncStorage.getItem("fullBlack");
        const nonCuberSaved = await AsyncStorage.getItem("nonCuber");
        const playerCountSaved = await AsyncStorage.getItem("playerCount");
        const colorThemeSaved = await AsyncStorage.getItem("colorTheme");
        const blindModeSaved = await AsyncStorage.getItem("blindMode");
        const boModeSaved = await AsyncStorage.getItem("boMode");
        const boRoundsSaved = await AsyncStorage.getItem("boRounds");

        if (fullBlackSaved !== null) {
          setFullBlack(JSON.parse(fullBlackSaved));
        }
        if (nonCuberSaved !== null) {
          setNonCuber(JSON.parse(nonCuberSaved));
        }
        if (playerCountSaved !== null) {
          setPlayerCount(JSON.parse(playerCountSaved));
        }
        if (colorThemeSaved !== null) {
          setColorTheme(JSON.parse(colorThemeSaved));
        }
        if (blindModeSaved !== null) {
          setBlindMode(JSON.parse(blindModeSaved));
        }
        if (boModeSaved !== null) {
          setBoMode(JSON.parse(boModeSaved));
        }
        if (boRoundsSaved !== null) {
          setBoRounds(JSON.parse(boRoundsSaved));
        }
      } catch (error) {
        console.log("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  // Sauvegarder l'option Full Black
  const toggleFullBlack = async (value: boolean) => {
    setFullBlack(value);
    try {
      await AsyncStorage.setItem("fullBlack", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving fullBlack setting:", error);
    }
  };

  // Sauvegarder l'option Non Cuber
  const toggleNonCuber = async (value: boolean) => {
    setNonCuber(value);
    try {
      await AsyncStorage.setItem("nonCuber", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving nonCuber setting:", error);
    }
  };

  // Sauvegarder le nombre de joueurs
  const updatePlayerCount = async (value: number) => {
    setPlayerCount(value);
    try {
      await AsyncStorage.setItem("playerCount", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving playerCount setting:", error);
    }
  };

  // Sauvegarder le thème de couleur
  const updateColorTheme = async (value: string) => {
    setColorTheme(value);
    try {
      await AsyncStorage.setItem("colorTheme", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving colorTheme setting:", error);
    }
  };

  // Sauvegarder le mode blind
  const toggleBlindMode = async (value: boolean) => {
    setBlindMode(value);
    try {
      await AsyncStorage.setItem("blindMode", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving blindMode setting:", error);
    }
  };

  // Sauvegarder le mode BO
  const toggleBoMode = async (value: boolean) => {
    setBoMode(value);
    try {
      await AsyncStorage.setItem("boMode", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving boMode setting:", error);
    }
  };

  // Sauvegarder le nombre de rounds BO
  const updateBoRounds = async (value: number) => {
    setBoRounds(value);
    try {
      await AsyncStorage.setItem("boRounds", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving boRounds setting:", error);
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Options
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: isDark ? "#888" : "#666" }]}
          >
            Personnalise ton expérience
          </ThemedText>
        </View>

        {/* Section Interface */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: getThemeColor() }]}>
            Interface
          </ThemedText>
          <View style={styles.sectionContent}>
            <View
              style={[
                styles.optionCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <ThemedText style={styles.optionTitle}>Full Black</ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Mode noir complet pour le battle
                  </ThemedText>
                </View>
                <Switch
                  value={fullBlack}
                  onValueChange={toggleFullBlack}
                  trackColor={{ false: "#767577", true: getThemeColor() }}
                  thumbColor={fullBlack ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>

            <View
              style={[
                styles.optionCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <ThemedText style={styles.optionTitle}>
                    Thème de couleur
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Choisis la couleur principale de l&apos;app
                  </ThemedText>
                </View>
              </View>
              <View style={styles.colorThemeContainer}>
                {colorThemes.map((theme) => (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.colorThemeButton,
                      {
                        backgroundColor: theme.primary,
                        borderColor:
                          colorTheme === theme.id ? "#fff" : "transparent",
                        borderWidth: colorTheme === theme.id ? 3 : 0,
                      },
                    ]}
                    onPress={() => updateColorTheme(theme.id)}
                  >
                    <ThemedText
                      style={[styles.colorThemeText, { color: "#fff" }]}
                    >
                      {theme.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Section Jeu */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: getThemeColor() }]}>
            Jeu
          </ThemedText>
          <View style={styles.sectionContent}>
            <View
              style={[
                styles.optionCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <ThemedText style={styles.optionTitle}>Non Cuber</ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Mode simple : chronos seulement, pas de mélanges ni
                    pénalités
                  </ThemedText>
                </View>
                <Switch
                  value={nonCuber}
                  onValueChange={toggleNonCuber}
                  trackColor={{ false: "#767577", true: getThemeColor() }}
                  thumbColor={nonCuber ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>

            <View
              style={[
                styles.optionCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <ThemedText style={styles.optionTitle}>
                    Nombre de joueurs
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Choisis le nombre de joueurs (2-4)
                  </ThemedText>
                </View>
              </View>
              <View style={styles.playerCountContainer}>
                {[2, 3, 4].map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[
                      styles.playerCountButton,
                      {
                        backgroundColor:
                          playerCount === count
                            ? getThemeColor()
                            : isDark
                            ? "#333"
                            : "#e0e0e0",
                      },
                    ]}
                    onPress={() => updatePlayerCount(count)}
                  >
                    <ThemedText
                      style={[
                        styles.playerCountText,
                        {
                          color:
                            playerCount === count
                              ? "#fff"
                              : isDark
                              ? "#fff"
                              : "#000",
                        },
                      ]}
                    >
                      {count}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Section Modes Avancés */}
        <View style={styles.sectionContainer}>
          <ThemedText style={[styles.sectionTitle, { color: getThemeColor() }]}>
            Modes Avancés
          </ThemedText>
          <View style={styles.sectionContent}>
            <View
              style={[
                styles.optionCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <ThemedText style={styles.optionTitle}>Mode Blind</ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Cache les temps pendant le solve
                  </ThemedText>
                </View>
                <Switch
                  value={blindMode}
                  onValueChange={toggleBlindMode}
                  trackColor={{ false: "#767577", true: getThemeColor() }}
                  thumbColor={blindMode ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>

            <View
              style={[
                styles.optionCard,
                { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionText}>
                  <ThemedText style={styles.optionTitle}>
                    Mode Best Of
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.optionDescription,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Premier à gagner X rounds
                  </ThemedText>
                </View>
                <Switch
                  value={boMode}
                  onValueChange={toggleBoMode}
                  trackColor={{ false: "#767577", true: getThemeColor() }}
                  thumbColor={boMode ? "#fff" : "#f4f3f4"}
                />
              </View>
              {boMode && (
                <View style={styles.boRoundsContainer}>
                  <ThemedText
                    style={[
                      styles.boRoundsLabel,
                      { color: isDark ? "#888" : "#666" },
                    ]}
                  >
                    Nombre de rounds :
                  </ThemedText>
                  <View style={styles.boRoundsButtons}>
                    {[3, 5, 7, 9].map((rounds) => (
                      <TouchableOpacity
                        key={rounds}
                        style={[
                          styles.boRoundsButton,
                          {
                            backgroundColor:
                              boRounds === rounds
                                ? getThemeColor()
                                : isDark
                                ? "#333"
                                : "#e0e0e0",
                          },
                        ]}
                        onPress={() => updateBoRounds(rounds)}
                      >
                        <ThemedText
                          style={[
                            styles.boRoundsText,
                            {
                              color:
                                boRounds === rounds
                                  ? "#fff"
                                  : isDark
                                  ? "#fff"
                                  : "#000",
                            },
                          ]}
                        >
                          BO{rounds}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Crédits */}
        <View style={styles.creditsContainer}>
          <ThemedText
            style={[styles.creditsText, { color: isDark ? "#888" : "#666" }]}
          >
            Made with 💖 by DrPepper{"\n"}Speedcube Master Studio
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
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionContent: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 4,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  playerCountContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    justifyContent: "center",
  },
  playerCountButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  playerCountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  colorThemeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    justifyContent: "center",
  },
  colorThemeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  colorThemeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  creditsContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  creditsText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
  boRoundsContainer: {
    marginTop: 16,
  },
  boRoundsLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  boRoundsButtons: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  boRoundsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  boRoundsText: {
    fontSize: 12,
    fontWeight: "600",
  },
  adContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  testButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  adStatus: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
