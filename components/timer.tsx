import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TimerProps = {
  isTop?: boolean;
  scramble?: string;
  lastTime?: number;
  lastPenalty?: "none" | "+2" | "DNF";
  score?: number;
  isWinner?: boolean;
  fullBlack?: boolean;
  nonCuber?: boolean;
  themeColor?: string;
  blindMode?: boolean;
  boMode?: boolean;
  boScore?: number;
  onStart?: () => void;
  onStop?: (time: number, penalty: "none" | "+2" | "DNF") => void;
  onReset?: () => void;
};

export function Timer({
  isTop = false,
  scramble,
  lastTime,
  lastPenalty = "none",
  score = 0,
  isWinner = false,
  fullBlack = false,
  nonCuber = false,
  themeColor = "#4CAF50",
  blindMode = false,
  boMode = false,
  boScore = 0,
  onStart,
  onStop,
  onReset,
}: TimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [appliedPenalty, setAppliedPenalty] = useState<"none" | "+2" | "DNF">(
    "none"
  );
  const [showTime, setShowTime] = useState(true); // Pour le mode blind
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Gérer le mode blind
  useEffect(() => {
    if (blindMode && isRunning) {
      setShowTime(false);
    } else if (blindMode && !isRunning && time > 0) {
      setShowTime(true);
    }
  }, [blindMode, isRunning, time]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const handlePressIn = () => {
    if (isRunning) {
      setIsRunning(false);
      setFinished(true);
      setCurrentTime(time);
      if (nonCuber) {
        // Mode non cuber : pas de pénalités, arrêt direct
        onStop?.(time, "none");
      } else {
        setShowPenalty(true);
      }
    } else if (!isRunning && !finished && !showPenalty) {
      setIsReady(true);
    }
  };

  const handlePressOut = () => {
    if (isReady && !isRunning && !finished) {
      setIsRunning(true);
      setTime(0);
      setIsReady(false);
      onStart?.();
    }
  };

  const handlePenalty = (penalty: "none" | "+2" | "DNF") => {
    setShowPenalty(false);
    setAppliedPenalty(penalty);
    if (penalty === "+2") {
      setTime(currentTime + 2000);
    }
    onStop?.(currentTime, penalty);
  };

  // Reset automatique quand le scramble change
  useEffect(() => {
    setTime(0);
    setFinished(false);
    setIsRunning(false);
    setIsReady(false);
    setShowPenalty(false);
    setAppliedPenalty("none");
  }, [scramble]);

  const backgroundColor = isReady
    ? themeColor
    : isRunning
    ? fullBlack
      ? "#000"
      : isDark
      ? "#1a1a1a"
      : "#ffffff"
    : fullBlack
    ? "#000"
    : isDark
    ? "#2a2a2a"
    : "#f0f0f0";

  const textColor = isReady
    ? "#ffffff"
    : isRunning
    ? isDark
      ? "#ffffff"
      : "#000000"
    : isDark
    ? "#888888"
    : "#666666";

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        { backgroundColor },
        isTop && styles.topContainer,
      ]}
      disabled={showPenalty}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.scoreDisplay,
            isWinner && { backgroundColor: themeColor },
            isTop && styles.topText,
          ]}
        >
          <Text
            style={[
              styles.scoreText,
              {
                color: isWinner ? "#fff" : isDark ? "#fff" : "#000",
              },
              isTop && styles.topText,
            ]}
          >
            {boMode ? boScore : score}
          </Text>
        </View>

        {scramble && !showPenalty && !nonCuber && (
          <Text
            style={[
              styles.scrambleText,
              { color: isDark ? "#aaa" : "#666" },
              isTop && styles.topText,
            ]}
          >
            {scramble}
          </Text>
        )}

        {showPenalty && !nonCuber ? (
          <View style={[styles.penaltyContainer, isTop && styles.topText]}>
            <Text
              style={[
                styles.penaltyTitle,
                { color: isDark ? "#fff" : "#000" },
                isTop && styles.topText,
              ]}
            >
              Pénalité ?
            </Text>
            <View style={[styles.penaltyButtons, isTop && styles.topText]}>
              <Pressable
                onPress={() => handlePenalty("none")}
                style={[
                  styles.penaltyButton,
                  { backgroundColor: isDark ? "#2a2a2a" : "#e0e0e0" },
                ]}
              >
                <Text
                  style={[
                    styles.penaltyButtonText,
                    { color: isDark ? "#fff" : "#000" },
                    isTop && styles.topText,
                  ]}
                >
                  OK
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handlePenalty("+2")}
                style={[styles.penaltyButton, { backgroundColor: "#FF9800" }]}
              >
                <Text
                  style={[styles.penaltyButtonText, isTop && styles.topText]}
                >
                  +2
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handlePenalty("DNF")}
                style={[styles.penaltyButton, { backgroundColor: "#f44336" }]}
              >
                <Text
                  style={[styles.penaltyButtonText, isTop && styles.topText]}
                >
                  DNF
                </Text>
              </Pressable>
            </View>
          </View>
        ) : appliedPenalty === "DNF" ? (
          <Text
            style={[
              styles.timeText,
              { color: "#f44336" },
              isTop && styles.topText,
            ]}
          >
            DNF
          </Text>
        ) : (
          <View style={styles.timeContainer}>
            <Text
              style={[
                styles.timeText,
                { color: textColor },
                isTop && styles.topText,
              ]}
            >
              {blindMode && !showTime ? "???" : formatTime(time)}
            </Text>
            {appliedPenalty === "+2" && (
              <Text
                style={[
                  styles.penaltyIndicator,
                  { color: "#FF9800" },
                  isTop && styles.topText,
                ]}
              >
                +2
              </Text>
            )}
          </View>
        )}

        {lastTime > 0 && !showPenalty && !nonCuber && (
          <View style={styles.lastTimeContainer}>
            <Text
              style={[
                styles.lastTimeText,
                { color: isDark ? "#666" : "#999" },
                isTop && styles.topText,
              ]}
            >
              Dernier:{" "}
              {lastPenalty === "DNF"
                ? "DNF"
                : formatTime(lastPenalty === "+2" ? lastTime + 2000 : lastTime)}
            </Text>
            {lastPenalty === "+2" && (
              <Text
                style={[
                  styles.lastTimePenalty,
                  { color: "#FF9800" },
                  isTop && styles.topText,
                ]}
              >
                {" "}
                (+2)
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  topContainer: {
    transform: [{ rotate: "180deg" }],
  },
  content: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  penaltyIndicator: {
    fontSize: 24,
    fontWeight: "bold",
  },
  lastTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastTimePenalty: {
    fontSize: 12,
    fontWeight: "600",
  },
  scoreDisplay: {
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    alignItems: "center",
  },
  scoreWinner: {
    // backgroundColor sera défini dynamiquement
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  scrambleText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  lastTimeText: {
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  penaltyContainer: {
    gap: 16,
    alignItems: "center",
  },
  penaltyTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  penaltyButtons: {
    flexDirection: "row",
    gap: 12,
  },
  penaltyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  penaltyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  topText: {
    // Le texte est déjà inversé par le container
  },
});
