import test from "node:test";
import assert from "node:assert/strict";
import {
  newGame,
  legalMoves,
  roll,
  choose,
  bank,
  nextTurn,
  HEIGHTS,
  restoreGame,
} from "../src/experiments/cant-stop/engine.ts";

test("all three dice partitions are available, with doubles applying twice", () => {
  const moves = legalMoves(newGame(["A", "B"]), [1, 2, 3, 4]);
  assert.deepEqual(
    moves.map((m) => m.id).sort(),
    ["3:1,7:1", "4:1,6:1", "5:2"].sort(),
  );
});
test("the final runner can open either of two new columns, never both", () => {
  const game = { ...newGame(["A", "B"]), runners: { 2: 1, 12: 1 } };
  const moves = legalMoves(game, [1, 2, 3, 4]);
  assert(moves.some((m) => m.id === "3:1"));
  assert(moves.some((m) => m.id === "7:1"));
  assert(moves.every((m) => Object.keys(m.runners).length <= 3));
  assert(moves.some((m) => m.id === "5:2"));
});
test("you must use both sums if an existing runner and an available new runner can move", () => {
  const moves = legalMoves(
    { ...newGame(["A", "B"]), runners: { 3: 1, 6: 1 } },
    [2, 4, 5, 5],
  );
  assert(moves.some((m) => m.id === "6:1,10:1"));
  assert(!moves.some((m) => m.id === "6:1"));
});
test("capped runners occupy their slots; a bust loses only unbanked progress", () => {
  let game = newGame(["A", "B"]);
  game.players[0].progress = { 2: 1 };
  game = { ...game, phase: "decision", runners: { 2: HEIGHTS[2], 3: 2, 4: 2 } };
  game = roll(game, () => 0.999);
  assert.equal(game.phase, "bust");
  assert.deepEqual(game.runners, {});
  assert.equal(game.players[0].progress[2], 1);
  game = nextTurn(game);
  assert.equal(game.current, 1);
});
test("a closed sum can be ignored while the other sum advances", () => {
  const game = { ...newGame(["A", "B"]), claims: { 3: 1 } };
  assert(legalMoves(game, [1, 2, 3, 4]).some((m) => m.id === "7:1"));
  assert(
    legalMoves(game, [1, 2, 3, 4]).every((m) => m.advances[3] === undefined),
  );
});
test("reaching the top is not a claim until banking; banking three columns wins", () => {
  let game = newGame(["A", "B"]);
  game.players[1].progress = { 2: 2, 3: 1 };
  game = { ...game, phase: "decision", runners: { 2: 3, 3: 5, 4: 7 } };
  assert.deepEqual(game.claims, {});
  game = bank(game);
  assert.equal(game.phase, "won");
  assert.equal(game.current, 0);
  assert.deepEqual(game.claims, { 2: 0, 3: 0, 4: 0 });
  assert.deepEqual(game.players[1].progress, {});
});
test("banking advances the turn and resumes from saved progress", () => {
  let game = { ...newGame(["A", "B"]), phase: "decision", runners: { 7: 4 } };
  game = bank(game);
  assert.equal(game.players[0].progress[7], 4);
  assert.equal(game.current, 1);
  game = nextTurn(game);
  assert.equal(
    legalMoves(game, [3, 4, 3, 4]).find((m) => m.id === "7:2").runners[7],
    6,
  );
});
test("illegal state transitions do nothing and a pairing cannot be chosen twice", () => {
  let game = newGame(["A", "B"]);
  assert.equal(bank(game), game);
  assert.equal(choose(game, "5:2"), game);
  game = roll(game, () => 0);
  assert.equal(game.phase, "choose");
  game = choose(game, legalMoves(game)[0].id);
  assert.equal(game.runners[2], 2);
  assert.equal(choose(game, "2:2"), game);
});
test("saved games validate shape and reject corrupted data", () => {
  const game = newGame(["A", "B"]);
  assert.deepEqual(restoreGame(JSON.stringify(game)), game);
  assert.equal(restoreGame("{oops"), null);
  assert.equal(
    restoreGame(JSON.stringify({ ...game, runners: { 7: 99 } })),
    null,
  );
  assert.equal(restoreGame(JSON.stringify({ ...game, current: 4 })), null);
});
test("all possible dice rolls respect three-runner and board-height limits", () => {
  const game = {
    ...newGame(["A", "B"]),
    runners: { 2: 3, 7: 11 },
    claims: { 12: 1 },
  };
  for (let a = 1; a <= 6; a++)
    for (let b = 1; b <= 6; b++)
      for (let c = 1; c <= 6; c++)
        for (let d = 1; d <= 6; d++) {
          for (const move of legalMoves(game, [a, b, c, d])) {
            assert(Object.keys(move.runners).length <= 3);
            for (const [col, value] of Object.entries(move.runners))
              assert(value <= HEIGHTS[col]);
            assert.equal(move.runners[12], undefined);
            assert(
              Object.values(move.advances).reduce((sum, n) => sum + n, 0) <= 2,
            );
          }
        }
});
