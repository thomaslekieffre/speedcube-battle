import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function SupportScreen() {
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

  const handleSupport = async () => {
    try {
      await Linking.openURL("https://paypal.me/Tlekieffredev");
    } catch (error) {
      console.log("Error opening PayPal:", error);
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
          <ThemedText style={[styles.title, { color: getThemeColor() }]}>
            💖 Soutenez Speedcube Battle
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: isDark ? "#888" : "#666" }]}
          >
            Aidez-moi à publier &apos;app sur Google Play
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
            ]}
          >
            <ThemedText style={styles.cardTitle}>🎯 Objectif</ThemedText>
            <ThemedText
              style={[styles.cardText, { color: isDark ? "#ccc" : "#333" }]}
            >
              J&apos;ai besoin de 25€ pour publier Speedcube Battle sur Google
              Play Store. Votre soutien&apos;aiderait énormément à partager
              cette app avec le monde !
            </ThemedText>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
            ]}
          >
            <ThemedText style={styles.cardTitle}>
              🚀 Ce que vous obtenez
            </ThemedText>
            <ThemedText
              style={[styles.cardText, { color: isDark ? "#ccc" : "#333" }]}
            >
              • App gratuite et sans publicités
              {"\n"}• Mises à jour régulières
              {"\n"}• Support de tous les types de cubes
              {"\n"}• Modes de jeu avancés (Blind, Best Of)
              {"\n"}• Interface personnalisable
            </ThemedText>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" },
            ]}
          >
            <ThemedText style={styles.cardTitle}>
              💳 Comment soutenir
            </ThemedText>
            <ThemedText
              style={[styles.cardText, { color: isDark ? "#ccc" : "#333" }]}
            >
              Cliquez sur le bouton ci-dessous pour être redirigé vers PayPal.
              Tous les montants sont les bienvenus, même 1€ fait la différence !
              🙏
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.supportButton, { backgroundColor: getThemeColor() }]}
            onPress={handleSupport}
          >
            <ThemedText style={styles.supportButtonText}>
              💳 Soutenir sur PayPal
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.thankYou}>
            <ThemedText
              style={[styles.thankYouText, { color: isDark ? "#888" : "#666" }]}
            >
              Merci pour votre soutien ! 💖
            </ThemedText>
            <ThemedText
              style={[styles.creditText, { color: isDark ? "#888" : "#666" }]}
            >
              Made with 💖 by DrPepper Speedcube Master Studio
            </ThemedText>
          </View>
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
  content: {
    gap: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  supportButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  thankYou: {
    alignItems: "center",
    marginTop: 32,
    gap: 8,
  },
  thankYouText: {
    fontSize: 16,
    fontWeight: "600",
  },
  creditText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },
});
