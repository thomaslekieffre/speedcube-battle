import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function PeriodicSupportModal() {
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const checkPeriodicSupport = async () => {
      try {
        const hasShownSupport = await AsyncStorage.getItem("hasShownPeriodicSupport");
        const appUsageCount = await AsyncStorage.getItem("appUsageCount");
        
        if (!hasShownSupport) {
          const count = appUsageCount ? parseInt(appUsageCount) : 0;
          
          // Afficher la popup après 5 utilisations
          if (count >= 5) {
            setShowModal(true);
          }
        }
      } catch (error) {
        console.log("Error checking periodic support:", error);
      }
    };
    checkPeriodicSupport();
  }, []);

  // Empêcher la fermeture automatique
  const handleBackPress = () => {
    return true;
  };

  const handleSupport = async () => {
    try {
      await Linking.openURL("https://paypal.me/Tlekieffredev");
      setShowModal(false);
    } catch (error) {
      console.log("Error opening PayPal:", error);
    }
  };

  const handleDontShowAgain = async () => {
    setDontShowAgain(true);
    try {
      await AsyncStorage.setItem("hasShownPeriodicSupport", "true");
    } catch (error) {
      console.log("Error saving periodic support preference:", error);
    }
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={handleBackPress}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => {}}
        >
          <ThemedView
            style={[
              styles.modal,
              {
                backgroundColor: isDark ? "#1a1a1a" : "#fff",
                borderColor: isDark ? "#333" : "#e0e0e0",
              },
            ]}
          >
            <View style={styles.header}>
              <ThemedText style={styles.title}>💖 Vous aimez l'app ?</ThemedText>
              <ThemedText
                style={[styles.subtitle, { color: isDark ? "#888" : "#666" }]}
              >
                Soutenez le développement !
              </ThemedText>
            </View>

            <View style={styles.content}>
              <ThemedText
                style={[styles.message, { color: isDark ? "#ccc" : "#333" }]}
              >
                Vous utilisez Speedcube Battle régulièrement ! 🎉
                {"\n\n"}
                Aidez-moi à publier l'app sur Google Play avec 25€.
                Votre soutien fait la différence ! 🙏
              </ThemedText>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.supportButton, { backgroundColor: "#0070ba" }]}
                  onPress={handleSupport}
                >
                  <ThemedText style={styles.supportButtonText}>
                    💳 Soutenir sur PayPal
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: isDark ? "#333" : "#f0f0f0" },
                  ]}
                  onPress={handleClose}
                >
                  <ThemedText
                    style={[
                      styles.closeButtonText,
                      { color: isDark ? "#fff" : "#333" },
                    ]}
                  >
                    Plus tard
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.dontShowContainer}
                onPress={handleDontShowAgain}
              >
                <ThemedText
                  style={[
                    styles.dontShowText,
                    { color: isDark ? "#888" : "#666" },
                  ]}
                >
                  Ne plus afficher
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlayTouchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  supportButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dontShowContainer: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dontShowText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
