export const HEIGHTS: Record<number, number> = {
  2: 3,
  3: 5,
  4: 7,
  5: 9,
  6: 11,
  7: 13,
  8: 11,
  9: 9,
  10: 7,
  11: 5,
  12: 3,
};
export const COLUMNS = Object.keys(HEIGHTS).map(Number);
export type Progress = Record<number, number>;
export type Player = { name: string; progress: Progress };
export type Game = {
  players: Player[];
  current: number;
  claims: Record<number, number>;
  runners: Progress;
  dice: number[];
  phase: "ready" | "choose" | "decision" | "bust" | "won";
  turn: number;
  message: string;
};
export type Move = {
  id: string;
  sums: number[];
  runners: Progress;
  advances: Progress;
};
export function newGame(names: string[]): Game {
  if (names.length < 2 || names.length > 4)
    throw new Error("Choose 2–4 players.");
  return {
    players: names.map((name, i) => ({
      name: name.trim().slice(0, 24) || `Player ${i + 1}`,
      progress: {},
    })),
    current: 0,
    claims: {},
    runners: {},
    dice: [],
    phase: "ready",
    turn: 1,
    message: "Roll four dice to start your turn.",
  };
}
export function legalMoves(game: Game, dice = game.dice): Move[] {
  if (
    dice.length !== 4 ||
    dice.some((d) => !Number.isInteger(d) || d < 1 || d > 6)
  )
    return [];
  const [a, b, c, d] = dice;
  const pairings = [
    [a + b, c + d],
    [a + c, b + d],
    [a + d, b + c],
  ];
  const outcomes = new Map<string, Move>();
  for (const sums of pairings) {
    // Both orders matter when one runner is left and both sums open new columns.
    for (const order of [sums, [sums[1], sums[0]]]) {
      const runners = { ...game.runners };
      const advances: Progress = {};
      for (const column of order) {
        if (game.claims[column] !== undefined) continue;
        if (runners[column] === undefined && Object.keys(runners).length === 3)
          continue;
        const position =
          runners[column] ?? game.players[game.current].progress[column] ?? 0;
        if (position >= HEIGHTS[column]) continue;
        runners[column] = position + 1;
        advances[column] = (advances[column] || 0) + 1;
      }
      if (!Object.keys(advances).length) continue;
      const id = COLUMNS.filter((col) => advances[col])
        .map((col) => `${col}:${advances[col]}`)
        .join(",");
      if (!outcomes.has(id)) outcomes.set(id, { id, sums, runners, advances });
    }
  }
  return [...outcomes.values()];
}
export function roll(game: Game, random = Math.random): Game {
  if (game.phase !== "ready" && game.phase !== "decision") return game;
  const dice = Array.from({ length: 4 }, () => Math.floor(random() * 6) + 1);
  const possible = legalMoves(game, dice);
  return {
    ...game,
    dice,
    phase: possible.length ? "choose" : "bust",
    runners: possible.length ? game.runners : {},
    message: possible.length
      ? "Choose a pairing. Use both sums when possible."
      : "Bust! All unbanked progress from this turn is lost.",
  };
}
export function choose(game: Game, id: string): Game {
  if (game.phase !== "choose") return game;
  const move = legalMoves(game).find((m) => m.id === id);
  return move
    ? {
        ...game,
        runners: move.runners,
        phase: "decision",
        message: "Bank your progress, or risk another roll?",
      }
    : game;
}
export function nextTurn(game: Game): Game {
  return {
    ...game,
    current: (game.current + 1) % game.players.length,
    runners: {},
    dice: [],
    phase: "ready",
    turn: game.turn + 1,
    message: "New turn. Roll four dice to begin.",
  };
}
export function bank(game: Game): Game {
  if (game.phase !== "decision") return game;
  const players = game.players.map((p) => ({
    ...p,
    progress: { ...p.progress },
  }));
  const claims = { ...game.claims };
  for (const [key, value] of Object.entries(game.runners)) {
    const col = Number(key);
    players[game.current].progress[col] = value;
    if (value === HEIGHTS[col]) {
      claims[col] = game.current;
      players.forEach((p, i) => {
        if (i !== game.current) delete p.progress[col];
      });
    }
  }
  const updated = { ...game, players, claims };
  if (
    Object.values(claims).filter((owner) => owner === game.current).length >= 3
  )
    return {
      ...updated,
      runners: {},
      phase: "won",
      message: `${players[game.current].name} wins with three columns!`,
    };
  return {
    ...nextTurn(updated),
    message: `${game.players[game.current].name} banked their progress. Next player’s turn.`,
  };
}
export function restoreGame(raw: string | null): Game | null {
  try {
    const g = JSON.parse(raw || "null") as Game | null;
    if (
      !g ||
      !Array.isArray(g.players) ||
      g.players.length < 2 ||
      g.players.length > 4 ||
      !Number.isInteger(g.current) ||
      g.current < 0 ||
      g.current >= g.players.length ||
      !Number.isInteger(g.turn) ||
      g.turn < 1 ||
      typeof g.message !== "string" ||
      !["ready", "choose", "decision", "bust", "won"].includes(g.phase)
    )
      return null;
    const validProgress = (p: Progress) =>
      p &&
      typeof p === "object" &&
      !Array.isArray(p) &&
      Object.entries(p).every(
        ([col, value]) =>
          COLUMNS.includes(Number(col)) &&
          Number.isInteger(value) &&
          value >= 1 &&
          value <= HEIGHTS[Number(col)],
      );
    if (
      !g.players.every(
        (p) =>
          typeof p.name === "string" &&
          p.name.length <= 24 &&
          validProgress(p.progress),
      ) ||
      !validProgress(g.runners) ||
      Object.keys(g.runners).length > 3
    )
      return null;
    if (
      !g.claims ||
      typeof g.claims !== "object" ||
      Array.isArray(g.claims) ||
      !Object.entries(g.claims).every(
        ([col, owner]) =>
          COLUMNS.includes(Number(col)) &&
          Number.isInteger(owner) &&
          owner >= 0 &&
          owner < g.players.length,
      )
    )
      return null;
    if (
      !Array.isArray(g.dice) ||
      ![0, 4].includes(g.dice.length) ||
      g.dice.some((d) => !Number.isInteger(d) || d < 1 || d > 6)
    )
      return null;
    if (["choose", "decision", "bust"].includes(g.phase) && g.dice.length !== 4)
      return null;
    if (g.phase === "choose" && !legalMoves(g).length) return null;
    return g;
  } catch {
    return null;
  }
}
