export type CubeType =
  | "2x2"
  | "3x3"
  | "4x4"
  | "pyraminx"
  | "skewb"
  | "clock"
  | "square1"
  | "blindfold";

// Générateur de scrambles pour différents types de cubes
export function generateScramble(cubeType: CubeType = "3x3"): string {
  switch (cubeType) {
    case "2x2":
      return generate2x2Scramble();
    case "3x3":
      return generate3x3Scramble();
    case "4x4":
      return generate4x4Scramble();
    case "pyraminx":
      return generatePyraminxScramble();
    case "skewb":
      return generateSkewbScramble();
    case "clock":
      return generateClockScramble();
    case "square1":
      return generateSquare1Scramble();
    case "blindfold":
      return generateBlindfoldScramble();
    default:
      return generate3x3Scramble();
  }
}

// 2x2x2 scramble (9 mouvements)
function generate2x2Scramble(): string {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  const scramble: string[] = [];
  let lastMove = "";
  let lastAxis = "";

  for (let i = 0; i < 9; i++) {
    let move: string;
    let axis: string;

    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      if (move === "U" || move === "D") axis = "UD";
      else if (move === "L" || move === "R") axis = "LR";
      else axis = "FB";
    } while (move === lastMove || axis === lastAxis);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
    lastAxis = axis;
  }

  return scramble.join(" ");
}

// 3x3x3 scramble (20 mouvements)
function generate3x3Scramble(): string {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  const scramble: string[] = [];
  let lastMove = "";
  let lastAxis = "";

  for (let i = 0; i < 20; i++) {
    let move: string;
    let axis: string;

    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      if (move === "U" || move === "D") axis = "UD";
      else if (move === "L" || move === "R") axis = "LR";
      else axis = "FB";
    } while (move === lastMove || axis === lastAxis);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
    lastAxis = axis;
  }

  return scramble.join(" ");
}

// 4x4x4 scramble (40 mouvements)
function generate4x4Scramble(): string {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  const scramble: string[] = [];
  let lastMove = "";
  let lastAxis = "";

  for (let i = 0; i < 40; i++) {
    let move: string;
    let axis: string;

    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      if (move === "U" || move === "D") axis = "UD";
      else if (move === "L" || move === "R") axis = "LR";
      else axis = "FB";
    } while (move === lastMove || axis === lastAxis);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
    lastAxis = axis;
  }

  return scramble.join(" ");
}

// Pyraminx scramble (10 mouvements)
function generatePyraminxScramble(): string {
  const tips = ["u", "l", "r", "b"];
  const moves = ["U", "L", "R", "B"];
  const modifiers = ["", "'"];
  const scramble: string[] = [];

  // 6 mouvements de base
  for (let i = 0; i < 6; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
  }

  // 4 tips
  for (let i = 0; i < 4; i++) {
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(tip + modifier);
  }

  return scramble.join(" ");
}

// Skewb scramble (9 mouvements)
function generateSkewbScramble(): string {
  const moves = ["R", "L", "U", "B"];
  const modifiers = ["", "'"];
  const scramble: string[] = [];
  let lastMove = "";

  for (let i = 0; i < 9; i++) {
    let move: string;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
  }

  return scramble.join(" ");
}

// Clock scramble
function generateClockScramble(): string {
  const pins = ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL"];
  const scramble: string[] = [];

  for (const pin of pins) {
    const amount = Math.floor(Math.random() * 6) + 1;
    scramble.push(`${pin}+${amount}`);
  }

  return scramble.join(" ");
}

// Square-1 scramble
function generateSquare1Scramble(): string {
  const scramble: string[] = [];

  for (let i = 0; i < 12; i++) {
    const top = Math.floor(Math.random() * 6) - 3;
    const bottom = Math.floor(Math.random() * 6) - 3;
    scramble.push(`(${top},${bottom})`);
  }

  return scramble.join(" ");
}

// Blindfolded scramble (3x3 + wide moves à la fin)
function generateBlindfoldScramble(): string {
  // Génère un scramble 3x3 normal
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  const scramble: string[] = [];
  let lastMove = "";
  let lastAxis = "";

  for (let i = 0; i < 20; i++) {
    let move: string;
    let axis: string;

    do {
      move = moves[Math.floor(Math.random() * moves.length)];
      if (move === "U" || move === "D") axis = "UD";
      else if (move === "L" || move === "R") axis = "LR";
      else axis = "FB";
    } while (move === lastMove || axis === lastAxis);

    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastMove = move;
    lastAxis = axis;
  }

  // Ajoute des mouvements wide aléatoires à la fin (conforme WCA)
  const wideMoves = [
    "Fw",
    "Fw'",
    "Fw2",
    "Uw",
    "Uw'",
    "Uw2",
    "Rw",
    "Rw'",
    "Rw2",
  ];
  const numWideMoves = Math.floor(Math.random() * 3) + 1; // 1 à 3 mouvements wide

  for (let i = 0; i < numWideMoves; i++) {
    const wideMove = wideMoves[Math.floor(Math.random() * wideMoves.length)];
    scramble.push(wideMove);
  }

  return scramble.join(" ");
}
