import { useEffect, useState } from "react";
import {
  bank,
  choose,
  COLUMNS,
  HEIGHTS,
  legalMoves,
  newGame,
  nextTurn,
  restoreGame,
  roll,
} from "./engine";
import type { Game } from "./engine";
import "./cant-stop.css";

const KEY = "pages-lab:cant-stop:v1";
const COLORS = ["#b24b3e", "#3b718e", "#8771a2", "#a17a24"];
const FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
function load() {
  try {
    return restoreGame(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export default function CantStop() {
  const [game, setGame] = useState<Game | null>(load);
  const [count, setCount] = useState(2);
  const [names, setNames] = useState([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
  ]);
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    if (game) {
      try {
        localStorage.setItem(KEY, JSON.stringify(game));
        setError("");
      } catch {
        setError(
          "Saving is unavailable. Keep this page open to finish your game.",
        );
      }
    }
  }, [game]);
  function reset() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* The next game will overwrite old state if storage returns. */
    }
    setGame(null);
    setConfirmReset(false);
  }
  const player = game?.players[game.current];
  const moves = game?.phase === "choose" ? legalMoves(game) : [];
  return (
    <>
      <section className="wrap page-intro">
        <p className="eyebrow">EXPERIMENT 03 / ONE MORE ROLL?</p>
        <h1>Can’t Stop</h1>
        <p>
          A shared-screen, push-your-luck dice game for 2–4 people. Claim three
          columns to win. Knowing when to stop is the hard part.
        </p>
      </section>
      <div className="wrap experiment-body">
        {!game ? (
          <section className="panel game-setup">
            <p className="eyebrow">GATHER ROUND</p>
            <h2>Who’s playing?</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setGame(newGame(names.slice(0, count)));
              }}
            >
              <label className="field">
                Number of players
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                >
                  {[2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} players
                    </option>
                  ))}
                </select>
              </label>
              <div className="player-inputs">
                {names.slice(0, count).map((name, i) => (
                  <label className="field" key={i}>
                    <span>
                      <i
                        className="player-dot"
                        style={{ background: COLORS[i] }}
                      />{" "}
                      Player {i + 1}
                      <input
                        value={name}
                        maxLength={24}
                        onChange={(e) =>
                          setNames((current) =>
                            current.map((n, j) =>
                              j === i ? e.target.value : n,
                            ),
                          )
                        }
                      />
                    </span>
                  </label>
                ))}
              </div>
              <button className="button">Start a game →</button>
            </form>
            <p className="muted">
              Pass the screen between turns. Your game saves on this device.
            </p>
          </section>
        ) : (
          <>
            <div className="player-strip">
              {game.players.map((p, i) => (
                <div
                  key={i}
                  className={game.current === i ? "current-player" : ""}
                  style={{
                    borderColor: game.current === i ? COLORS[i] : undefined,
                  }}
                >
                  <span
                    className="player-dot"
                    style={{ background: COLORS[i] }}
                  />
                  <strong>{p.name}</strong>
                  <span>
                    {
                      Object.values(game.claims).filter((owner) => owner === i)
                        .length
                    }{" "}
                    / 3 columns
                  </span>
                  {i === game.current && (
                    <small>{game.phase === "won" ? "WINNER" : "PLAYING"}</small>
                  )}
                </div>
              ))}
            </div>
            <div className="game-layout">
              <section className="board-panel" aria-label="Game board">
                <div
                  className="board-scroll"
                  tabIndex={0}
                  aria-label="Scrollable board: columns 2 through 12"
                >
                  <div className="board">
                    {COLUMNS.map((col) => (
                      <div
                        className={`board-column ${game.claims[col] !== undefined ? "claimed" : ""}`}
                        key={col}
                      >
                        <div
                          className="column-cap"
                          style={{
                            background:
                              game.claims[col] !== undefined
                                ? COLORS[game.claims[col]]
                                : undefined,
                            color:
                              game.claims[col] !== undefined
                                ? "white"
                                : undefined,
                          }}
                        >
                          {col}
                          {game.claims[col] !== undefined && (
                            <span
                              aria-label={`Claimed by ${game.players[game.claims[col]].name}`}
                            >
                              ★
                            </span>
                          )}
                        </div>
                        <div className="column-steps">
                          {Array.from(
                            { length: HEIGHTS[col] },
                            (_, i) => HEIGHTS[col] - i,
                          ).map((step) => (
                            <div className="board-step" key={step}>
                              <div className="permanent-markers">
                                {game.players.map((p, j) =>
                                  p.progress[col] === step ? (
                                    <span
                                      key={j}
                                      className="banked-marker"
                                      style={{ background: COLORS[j] }}
                                      title={`${p.name}: ${step}/${HEIGHTS[col]}`}
                                      aria-label={`${p.name}, column ${col}, step ${step}`}
                                    >
                                      {j + 1}
                                    </span>
                                  ) : null,
                                )}
                              </div>
                              {game.runners[col] === step && (
                                <span
                                  className="runner-marker"
                                  title={`${player?.name}'s unbanked runner`}
                                  aria-label={`Unbanked runner, column ${col}, step ${step}`}
                                >
                                  ◆
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <span className="column-base">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="board-legend">
                  <span>◆ White runners = this turn’s progress</span>
                  <span>● Coloured markers = banked progress</span>
                </p>
              </section>
              <section className="panel turn-panel">
                <p className="eyebrow">TURN {game.turn}</p>
                <h2>
                  <span
                    className="player-dot"
                    style={{ background: COLORS[game.current] }}
                  />
                  {player?.name}
                  {game.phase === "won" ? " wins!" : "’s turn"}
                </h2>
                <p
                  className={`turn-message ${game.phase === "bust" ? "bust-message" : ""}`}
                  role="status"
                >
                  {game.message}
                </p>
                <div
                  className="dice-row"
                  aria-label={
                    game.dice.length
                      ? `Dice: ${game.dice.join(", ")}`
                      : "No dice rolled yet"
                  }
                >
                  {(game.dice.length ? game.dice : [0, 0, 0, 0]).map((d, i) => (
                    <span key={i} className="die" aria-hidden="true">
                      {FACES[d] || "·"}
                    </span>
                  ))}
                </div>
                {game.phase === "choose" && (
                  <div className="pairing-options">
                    <p className="small-label">CHOOSE HOW TO PAIR THE DICE</p>
                    {moves.map((move) => (
                      <button
                        key={move.id}
                        className="pairing"
                        onClick={() => setGame(choose(game, move.id))}
                      >
                        <strong>
                          {move.sums[0]} <span>&</span> {move.sums[1]}
                        </strong>
                        <span>
                          {Object.entries(move.advances)
                            .map(([col, steps]) => `${col}: +${steps}`)
                            .join(" · ")}{" "}
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {game.phase === "ready" && (
                  <button
                    className="button game-action"
                    onClick={() => setGame(roll(game))}
                  >
                    Roll four dice
                  </button>
                )}
                {game.phase === "decision" && (
                  <div className="decision-buttons">
                    <button
                      className="button"
                      onClick={() => setGame(roll(game))}
                    >
                      Risk another roll ↻
                    </button>
                    <button
                      className="button secondary"
                      onClick={() => setGame(bank(game))}
                    >
                      Bank & end turn
                    </button>
                  </div>
                )}
                {game.phase === "bust" && (
                  <button
                    className="button game-action"
                    onClick={() => setGame(nextTurn(game))}
                  >
                    Next:{" "}
                    {
                      game.players[(game.current + 1) % game.players.length]
                        .name
                    }{" "}
                    →
                  </button>
                )}
                {game.phase === "won" && (
                  <div className="winner-banner">
                    Three columns. Excellent restraint.
                    <br />
                    <button className="button" onClick={reset}>
                      Play again
                    </button>
                  </div>
                )}
                <div className="runner-summary">
                  <span className="small-label">
                    RUNNERS {Object.keys(game.runners).length} / 3
                  </span>
                  {Object.entries(game.runners).map(([col, pos]) => (
                    <div key={col}>
                      <span>Column {col}</span>
                      <strong>
                        {pos} / {HEIGHTS[Number(col)]}
                      </strong>
                      {pos === HEIGHTS[Number(col)] && (
                        <small>Bank to claim!</small>
                      )}
                    </div>
                  ))}
                  {!Object.keys(game.runners).length && (
                    <p>No runners on the board.</p>
                  )}
                </div>
              </section>
            </div>
            <div className="game-bottom">
              <p className="muted">
                Saved automatically in this browser. Leave and return any time.
              </p>
              {!confirmReset ? (
                <button
                  className="text-button"
                  onClick={() => setConfirmReset(true)}
                >
                  Start a new game
                </button>
              ) : (
                <div className="button-row">
                  <span className="muted">Discard this game?</span>
                  <button className="button danger" onClick={reset}>
                    Yes, new game
                  </button>
                  <button
                    className="button secondary"
                    onClick={() => setConfirmReset(false)}
                  >
                    Keep playing
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {error && (
          <p role="alert" className="notice error">
            {error}
          </p>
        )}
        <details className="rules panel" open={!game}>
          <summary>How to play</summary>
          <ol>
            <li>
              Roll four dice and split them into two pairs. Each pair’s sum
              advances a runner in that numbered column. Equal sums can advance
              the same runner twice.
            </li>
            <li>
              You have three temporary runners per turn. Use both sums when you
              can. If only one runner remains and both sums need a new column,
              choose which column to open.
            </li>
            <li>
              After moving, either roll again or bank. Banking saves your
              runners’ positions and passes the turn. A roll with no legal move
              is a bust: lose only this turn’s unbanked progress.
            </li>
            <li>
              Reach a column’s top <strong>and bank</strong> to claim it.
              Claimed columns close for everyone. A runner at the top still
              occupies one of your three runner slots.
            </li>
            <li>The first player to claim three columns wins.</li>
          </ol>
          <p className="muted">
            Game design: Sid Sackson. An independent browser implementation with
            original interface artwork.{" "}
            <a
              href="https://www.yucata.de/en/Rules/CantStop"
              className="rules-link"
            >
              Rules reference ↗
            </a>
          </p>
        </details>
      </div>
    </>
  );
}
