import { useState } from "react";
import "./confusing-ux.css";

const initial = {
  rotation: 0,
  hue: 270,
  clicks: 0,
  direction: "normal",
  text: "",
  slider: 40,
  checked: false,
};
export default function ConfusingUX() {
  const [state, setState] = useState(initial);
  const [resetKey, setResetKey] = useState(0);
  const [message, setMessage] = useState("Everything is probably fine.");
  const update = (patch: Partial<typeof initial>) =>
    setState((current) => ({ ...current, ...patch }));
  function type(value: string) {
    if (value.length <= state.text.length) {
      update({ text: value });
      return;
    }
    let prefix = 0;
    while (prefix < state.text.length && value[prefix] === state.text[prefix])
      prefix++;
    const added = value.slice(
      prefix,
      prefix + value.length - state.text.length,
    );
    let text = state.text;
    for (const letter of added) {
      const position = Math.floor(Math.random() * (text.length + 1));
      text = text.slice(0, position) + letter + text.slice(position);
    }
    update({ text });
  }
  function outside() {
    update({ clicks: state.clicks + 1 });
    setMessage(
      [
        "The background would like to thank you.",
        "You found the actual button. It is the absence of buttons.",
        "Another productive click in absolutely the wrong place.",
      ][state.clicks % 3],
    );
  }
  return (
    <>
      <section className="wrap page-intro">
        <p className="eyebrow">EXPERIMENT 02 / EXPECTATIONS, SUBVERTED</p>
        <h1>Confusing UX</h1>
        <p>
          A perfectly unreasonable interface. The navigation above is safe.
          Everything in the purple box has other plans.
        </p>
      </section>
      <div className="wrap experiment-body">
        <div className="chaos-toolbar">
          <p aria-live="polite">{message}</p>
          <button
            className="button secondary"
            onClick={() => {
              setState(initial);
              setResetKey((k) => k + 1);
              setMessage("Order restored. Temporarily.");
            }}
          >
            Reset the experiment
          </button>
        </div>
        <div
          className="chaos-viewport"
          style={{ background: `hsl(${state.hue} 38% 91%)` }}
          key={resetKey}
          onScroll={(e) => {
            const el = e.currentTarget;
            update({ hue: (270 + el.scrollTop * 0.5) % 360 });
          }}
        >
          <div
            className="chaos-surface"
            style={{ transform: `rotate(${state.rotation}deg)` }}
            onClick={(e) => {
              if (
                !(e.target as HTMLElement).closest(
                  "button,input,select,label,a,summary",
                )
              )
                outside();
            }}
          >
            <div className="chaos-banner">
              <p className="eyebrow">
                WELCOME TO THE DEPARTMENT OF UNEXPECTED BEHAVIOUR
              </p>
              <h2>
                Works as <s>expected</s> imagined.
              </h2>
              <span>
                ↓ Scroll to change the colour. Scrolling still scrolls.
              </span>
            </div>
            <div
              className="chaos-grid"
              style={{
                transform:
                  state.direction === "down"
                    ? "scaleY(1.18)"
                    : state.direction === "up"
                      ? "scaleY(.78)"
                      : state.direction === "right"
                        ? "scaleX(1.1)"
                        : state.direction === "left"
                          ? "scaleX(.82)"
                          : undefined,
                transformOrigin: "top center",
              }}
            >
              <section className="chaos-card">
                <span className="chaos-number">01 / AN ACTION BUTTON</span>
                <h3>Make something happen.</h3>
                <button className="useless-button" type="button">
                  Do something
                </button>
                <p>
                  Background clicks: <strong>{state.clicks}</strong>
                </p>
                <button className="background-button" onClick={outside}>
                  Keyboard-friendly patch of “outside”
                </button>
              </section>
              <section className="chaos-card">
                <span className="chaos-number">
                  02 / TEXT ENTRY, RECONSIDERED
                </span>
                <label className="field">
                  <strong>A perfectly ordinary text box</strong>
                  <input
                    aria-describedby="typing-hint"
                    value={state.text}
                    maxLength={120}
                    onChange={(e) => type(e.target.value)}
                    placeholder="Try typing your name…"
                  />
                </label>
                <p id="typing-hint">
                  Your letters arrive. Their seating arrangement is random.
                  Delete still deletes.
                </p>
              </section>
              <section className="chaos-card">
                <span className="chaos-number">
                  03 / A DIRECTIONAL DROPDOWN
                </span>
                <label className="field">
                  <strong>Adjust the existing content</strong>
                  <select
                    value={state.direction}
                    onChange={(e) => update({ direction: e.target.value })}
                  >
                    <option value="normal">A reasonable shape</option>
                    <option value="down">↓ Stretch down</option>
                    <option value="up">↑ Squish up</option>
                    <option value="right">→ Stretch right</option>
                    <option value="left">← Squish left</option>
                  </select>
                </label>
                <p>The arrow is a very literal suggestion.</p>
              </section>
              <section className="chaos-card">
                <span className="chaos-number">04 / GLOBAL SETTINGS*</span>
                <h3>Give it a little adjustment.</h3>
                <button
                  className="cog-button"
                  aria-label="Rotate the experiment clockwise 12 degrees"
                  onClick={() => {
                    update({ rotation: state.rotation + 12 });
                    setMessage(
                      "Settings applied to the entire experiment. Naturally.",
                    );
                  }}
                >
                  ⚙
                </button>
                <p>*Global to this box. Your escape route stays put.</p>
              </section>
              <section className="chaos-card">
                <span className="chaos-number">05 / A SLIGHT DISAGREEMENT</span>
                <label className="field">
                  <strong>Volume: {100 - state.slider}%</strong>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={state.slider}
                    onChange={(e) => update({ slider: Number(e.target.value) })}
                    aria-label="Backwards volume control"
                  />
                </label>
                <p>
                  Move right for less. Move left for more. There is no audio.
                </p>
              </section>
              <section className="chaos-card">
                <span className="chaos-number">06 / TERMS OF DISAGREEMENT</span>
                <label className="contrary-checkbox">
                  <input
                    type="checkbox"
                    checked={state.checked}
                    onChange={(e) => update({ checked: e.target.checked })}
                  />
                  I agree
                </label>
                <p className="checkbox-verdict">
                  {state.checked
                    ? "Thank you for disagreeing."
                    : "Your agreement has been noted."}
                </p>
                <p>The checkbox works. The copy has trust issues.</p>
              </section>
            </div>
            <p className="chaos-bottom">
              You reached the bottom. Nothing is accomplished. Beautiful.
            </p>
          </div>
        </div>
        <details className="chaos-explanation">
          <summary>Show the six tricks</summary>
          <p>
            Background clicks count; the main action button does not. Typing
            inserts new letters at random positions. The dropdown transforms the
            cards. The cog rotates the play area. The volume value runs
            backwards. The checkbox’s message contradicts its state. Scrolling
            changes the background colour.
          </p>
        </details>
      </div>
    </>
  );
}
