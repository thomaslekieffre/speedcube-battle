import { Timer } from "@/components/timer";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { CubeType, generateScramble } from "@/utils/scrambleGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SupportModal from "../support-modal";
import PeriodicSupportModal from "@/components/periodic-support-modal";

type SolveResult = {
  time: number;
  penalty: "none" | "+2" | "DNF";
  finalTime: number;
};

export default function HomeScreen() {
  const { cubeType: paramCubeType } = useLocalSearchParams<{
    cubeType: CubeType;
  }>();
  const [cubeType, setCubeType] = useState<CubeType>(paramCubeType || "3x3");
  const [scramble, setScramble] = useState(
    generateScramble(paramCubeType || "3x3")
  );
  // States pour gérer plusieurs joueurs
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [results, setResults] = useState<(SolveResult | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [lastTimes, setLastTimes] = useState<number[]>([0, 0, 0, 0]);
  const [lastPenalties, setLastPenalties] = useState<("none" | "+2" | "DNF")[]>(
    ["none", "none", "none", "none"]
  );
  const [winner, setWinner] = useState<number | null>(null);
  const [fullBlack, setFullBlack] = useState(false);
  const [nonCuber, setNonCuber] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);
  const [colorTheme, setColorTheme] = useState("default");
  const [blindMode, setBlindMode] = useState(false);
  const [boMode, setBoMode] = useState(false);
  const [boRounds, setBoRounds] = useState(3);
  const [boScore, setBoScore] = useState([0, 0, 0, 0]); // Score BO pour chaque joueur
  const [boWinner, setBoWinner] = useState<number | null>(null); // Gagnant du BO

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

        // Incrémenter le compteur d'utilisation
        const currentCount = await AsyncStorage.getItem("appUsageCount");
        const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
        await AsyncStorage.setItem("appUsageCount", newCount.toString());
      } catch (error) {
        console.log("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  // Écouter les changements d'options
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

    // Recharger les options quand on revient sur l'écran
    const interval = setInterval(loadSettings, 500);
    return () => clearInterval(interval);
  }, []);

  // Mettre à jour le cube type quand on reçoit un paramètre
  useEffect(() => {
    if (paramCubeType && paramCubeType !== cubeType) {
      setCubeType(paramCubeType);
      setScramble(generateScramble(paramCubeType));
    }
  }, [paramCubeType]);

  const calculateFinalTime = (
    time: number,
    penalty: "none" | "+2" | "DNF"
  ): number => {
    if (penalty === "DNF") return Infinity;
    if (penalty === "+2") return time + 2000;
    return time;
  };

  // Détection de la fin de round quand tous les joueurs actifs ont fini
  useEffect(() => {
    const activeResults = results.slice(0, playerCount);
    const allFinished = activeResults.every((result) => result !== null);

    if (allFinished) {
      // Trouver le gagnant (temps le plus bas)
      let bestTime = Infinity;
      let winnerIndex = -1;

      activeResults.forEach((result, index) => {
        if (result && result.finalTime < bestTime) {
          bestTime = result.finalTime;
          winnerIndex = index;
        }
      });

      if (winnerIndex !== -1) {
        setWinner(winnerIndex);

        if (boMode) {
          // Mode BO : incrémenter le score BO
          setBoScore((prevBoScore) => {
            const newBoScore = [...prevBoScore];
            newBoScore[winnerIndex] += 1;

            // Vérifier si quelqu'un a gagné le BO
            const maxScore = Math.max(...newBoScore);
            const requiredWins = Math.floor(boRounds / 2) + 1;

            if (maxScore >= requiredWins) {
              // Quelqu'un a gagné le BO
              const boWinnerIndex = newBoScore.indexOf(maxScore);
              setBoWinner(boWinnerIndex);

              // Reset après 3 secondes
              setTimeout(() => {
                setBoScore([0, 0, 0, 0]);
                setScores([0, 0, 0, 0]);
                setResults([null, null, null, null]);
                setLastTimes([0, 0, 0, 0]);
                setLastPenalties(["none", "none", "none", "none"]);
                setWinner(null);
                setBoWinner(null);
                setScramble(generateScramble(cubeType));
              }, 3000);
            }

            return newBoScore;
          });
        } else {
          // Mode normal : incrémenter les scores individuels
          setScores((prevScores) => {
            const newScores = [...prevScores];
            newScores[winnerIndex] += 1;
            return newScores;
          });
        }
      }

      // Nouveau round après 2 secondes
      setTimeout(async () => {
        // Sauvegarder les derniers temps
        setLastTimes(activeResults.map((result) => result?.time || 0));
        setLastPenalties(
          activeResults.map((result) => result?.penalty || "none")
        );
        setResults([null, null, null, null]);
        setWinner(null);

        // Générer nouveau scramble
        setScramble(generateScramble(cubeType));
      }, 2000);
    }
  }, [results, playerCount]);

  const handleResetScores = () => {
    setScores([0, 0, 0, 0]);
    setBoScore([0, 0, 0, 0]);
    setBoWinner(null);
    setResults([null, null, null, null]);
    setLastTimes([0, 0, 0, 0]);
    setLastPenalties(["none", "none", "none", "none"]);
    setScramble(generateScramble(cubeType));
    setWinner(null);
  };

  const handleStop = (
    playerIndex: number,
    time: number,
    penalty: "none" | "+2" | "DNF"
  ) => {
    const finalTime = calculateFinalTime(time, penalty);
    setResults((prevResults) => {
      const newResults = [...prevResults];
      newResults[playerIndex] = { time, penalty, finalTime };
      return newResults;
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: fullBlack ? "#000" : isDark ? "#000" : "#fff" },
      ]}
    >
      <StatusBar hidden />

      {/* Affichage des timers selon le nombre de joueurs */}
      {playerCount === 4 ? (
        <>
          {/* 2 timers en haut */}
          <View style={styles.topRow}>
            {[0, 1].map((index) => (
              <View
                key={index}
                style={[
                  styles.timerContainer,
                  styles.halfWidth,
                  fullBlack && { backgroundColor: "#000" },
                ]}
              >
                <Timer
                  isTop={true}
                  scramble={nonCuber ? undefined : scramble}
                  lastTime={lastTimes[index]}
                  lastPenalty={lastPenalties[index]}
                  score={scores[index]}
                  isWinner={winner === index}
                  fullBlack={fullBlack}
                  nonCuber={nonCuber}
                  themeColor={getThemeColor()}
                  blindMode={blindMode}
                  boMode={boMode}
                  boScore={boScore[index]}
                  onStop={(time, penalty) => handleStop(index, time, penalty)}
                  onReset={() => {
                    setResults((prevResults) => {
                      const newResults = [...prevResults];
                      newResults[index] = null;
                      return newResults;
                    });
                  }}
                />
              </View>
            ))}
          </View>

          {/* 2 timers en bas */}
          <View style={styles.bottomRow}>
            {[2, 3].map((index) => (
              <View
                key={index}
                style={[
                  styles.timerContainer,
                  styles.halfWidth,
                  fullBlack && { backgroundColor: "#000" },
                ]}
              >
                <Timer
                  isTop={false}
                  scramble={nonCuber ? undefined : scramble}
                  lastTime={lastTimes[index]}
                  lastPenalty={lastPenalties[index]}
                  score={scores[index]}
                  isWinner={winner === index}
                  fullBlack={fullBlack}
                  nonCuber={nonCuber}
                  themeColor={getThemeColor()}
                  blindMode={blindMode}
                  boMode={boMode}
                  boScore={boScore[index]}
                  onStop={(time, penalty) => handleStop(index, time, penalty)}
                  onReset={() => {
                    setResults((prevResults) => {
                      const newResults = [...prevResults];
                      newResults[index] = null;
                      return newResults;
                    });
                  }}
                />
              </View>
            ))}
          </View>
        </>
      ) : playerCount === 3 ? (
        <>
          {/* 1 timer en haut */}
          <View style={styles.topRow}>
            <View
              style={[
                styles.timerContainer,
                styles.halfWidth,
                fullBlack && { backgroundColor: "#000" },
              ]}
            >
              <Timer
                isTop={true}
                scramble={nonCuber ? undefined : scramble}
                lastTime={lastTimes[0]}
                lastPenalty={lastPenalties[0]}
                score={scores[0]}
                isWinner={winner === 0}
                fullBlack={fullBlack}
                nonCuber={nonCuber}
                onStop={(time, penalty) => handleStop(0, time, penalty)}
                onReset={() => {
                  setResults((prevResults) => {
                    const newResults = [...prevResults];
                    newResults[0] = null;
                    return newResults;
                  });
                }}
              />
            </View>
          </View>

          {/* 2 timers en bas */}
          <View style={styles.bottomRow}>
            {[1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.timerContainer,
                  styles.halfWidth,
                  fullBlack && { backgroundColor: "#000" },
                ]}
              >
                <Timer
                  isTop={false}
                  scramble={nonCuber ? undefined : scramble}
                  lastTime={lastTimes[index]}
                  lastPenalty={lastPenalties[index]}
                  score={scores[index]}
                  isWinner={winner === index}
                  fullBlack={fullBlack}
                  nonCuber={nonCuber}
                  themeColor={getThemeColor()}
                  blindMode={blindMode}
                  boMode={boMode}
                  boScore={boScore[index]}
                  onStop={(time, penalty) => handleStop(index, time, penalty)}
                  onReset={() => {
                    setResults((prevResults) => {
                      const newResults = [...prevResults];
                      newResults[index] = null;
                      return newResults;
                    });
                  }}
                />
              </View>
            ))}
          </View>
        </>
      ) : (
        /* 2 joueurs : affichage normal */
        <>
          <View
            style={[
              styles.timerContainer,
              fullBlack && { backgroundColor: "#000" },
            ]}
          >
            <Timer
              isTop={true}
              scramble={nonCuber ? undefined : scramble}
              lastTime={lastTimes[0]}
              lastPenalty={lastPenalties[0]}
              score={scores[0]}
              isWinner={winner === 0}
              fullBlack={fullBlack}
              nonCuber={nonCuber}
              themeColor={getThemeColor()}
              blindMode={blindMode}
              boMode={boMode}
              boScore={boScore[0]}
              onStop={(time, penalty) => handleStop(0, time, penalty)}
              onReset={() => {
                setResults((prevResults) => {
                  const newResults = [...prevResults];
                  newResults[0] = null;
                  return newResults;
                });
              }}
            />
          </View>

          <View
            style={[
              styles.timerContainer,
              fullBlack && { backgroundColor: "#000" },
            ]}
          >
            <Timer
              isTop={false}
              scramble={nonCuber ? undefined : scramble}
              lastTime={lastTimes[1]}
              lastPenalty={lastPenalties[1]}
              score={scores[1]}
              isWinner={winner === 1}
              fullBlack={fullBlack}
              nonCuber={nonCuber}
              themeColor={getThemeColor()}
              blindMode={blindMode}
              boMode={boMode}
              boScore={boScore[1]}
              onStop={(time, penalty) => handleStop(1, time, penalty)}
              onReset={() => {
                setResults((prevResults) => {
                  const newResults = [...prevResults];
                  newResults[1] = null;
                  return newResults;
                });
              }}
            />
          </View>
        </>
      )}

      {/* Section centrale avec bouton reset */}
      <View
        style={[
          styles.centerContainer,
          {
            backgroundColor: fullBlack
              ? "#000"
              : isDark
              ? "#1a1a1a"
              : "#f5f5f5",
          },
        ]}
      >
        {boMode ? (
          <View style={styles.boScoreContainer}>
            <Text
              style={[styles.boScoreText, { color: isDark ? "#fff" : "#000" }]}
            >
              BO{boRounds}: {boScore[0]} - {boScore[1]}
            </Text>
            {boWinner !== null && (
              <Text style={[styles.boWinnerText, { color: getThemeColor() }]}>
                Joueur {boWinner + 1} gagne le BO !
              </Text>
            )}
          </View>
        ) : (
          <Text style={[styles.scoreText, { color: isDark ? "#fff" : "#000" }]}>
            {scores[0]} - {scores[1]}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleResetScores}
          style={styles.resetButton}
        >
          <Text
            style={[
              styles.resetText,
              { color: fullBlack ? "#888" : isDark ? "#888" : "#666" },
            ]}
          >
            Reset Scores
          </Text>
        </TouchableOpacity>
      </View>
      <SupportModal />
      <PeriodicSupportModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerContainer: {
    flex: 1,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    flex: 1,
  },
  bottomRow: {
    flexDirection: "row",
    flex: 1,
  },
  halfWidth: {
    flex: 1,
    width: "50%",
  },
  centerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    padding: 8,
  },
  resetText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  boScoreContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  boScoreText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  boWinnerText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
});
