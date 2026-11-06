import { useEffect, useRef, useState } from "react";
import "./cookie-monster.css";

const STORAGE_KEY = "pages-lab:cookie-monster:v1";
const menu = [
  {
    id: "language",
    label: "Browser language",
    explanation: "The language your browser prefers.",
    read: () => navigator.language,
  },
  {
    id: "timezone",
    label: "Timezone",
    explanation: "Your browser’s timezone, not your precise location.",
    read: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  {
    id: "screen",
    label: "Screen size",
    explanation: "Your screen dimensions in CSS pixels.",
    read: () => `${screen.width} × ${screen.height}`,
  },
  {
    id: "theme",
    label: "Colour preference",
    explanation: "Whether your device asks websites for a dark appearance.",
    read: () =>
      matchMedia("(prefers-color-scheme: dark)").matches
        ? "Dark"
        : "Light / no preference",
  },
  {
    id: "touch",
    label: "Touch support",
    explanation: "The number of touch points your browser reports.",
    read: () => String(navigator.maxTouchPoints),
  },
  {
    id: "nickname",
    label: "A nickname",
    explanation: "An optional, made-up name. Please skip anything private.",
  },
  {
    id: "snack",
    label: "Favourite snack",
    explanation: "An optional snack recommendation for a very hungry monster.",
  },
] as const;
type Crumb = { id: string; label: string; value: string };
function readCrumbs(): Crumb[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );
    if (!Array.isArray(value)) return [];
    const valid = value.filter(
      (item): item is Crumb =>
        item &&
        typeof item.id === "string" &&
        typeof item.value === "string" &&
        item.value.length <= 200 &&
        menu.some((m) => m.id === item.id),
    );
    return menu.flatMap((item) => {
      const crumb = valid.find((c) => c.id === item.id);
      return crumb ? [{ ...crumb, label: item.label }] : [];
    });
  } catch {
    return [];
  }
}

export default function CookieMonster() {
  const [crumbs, setCrumbs] = useState(readCrumbs);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [eating, setEating] = useState(false);
  const [message, setMessage] = useState("Me hungry. You look… informative.");
  const [storageError, setStorageError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const feedButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const next = menu.find((item) => !crumbs.some((c) => c.id === item.id));
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [open]);
  function close() {
    setOpen(false);
    setAnswer("");
    feedButton.current?.focus();
  }
  function accept() {
    if (!next || eating) return;
    let value: string;
    try {
      value = "read" in next ? next.read() : answer.trim();
    } catch {
      setStorageError(
        "Your browser could not read this detail. You can decline this cookie.",
      );
      return;
    }
    if (!value) return;
    const updated = [...crumbs, { id: next.id, label: next.label, value }];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable. These crumbs will only last while this page is open.",
      );
    }
    setCrumbs(updated);
    close();
    setEating(true);
    setMessage(`OM NOM NOM. ${next.label.toUpperCase()}!`);
    timer.current = setTimeout(() => {
      setEating(false);
      setMessage(
        updated.length === menu.length
          ? "Me know enough. Me still want cookies."
          : "Delicious. Another tiny byte?",
      );
    }, 1300);
  }
  function forget() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageError(
        "Storage could not be cleared. Use your browser’s site-data settings to remove saved crumbs.",
      );
      return;
    }
    clearTimeout(timer.current);
    setEating(false);
    setCrumbs([]);
    setStorageError("");
    setMessage("Who you? Nice to meet you!");
  }
  return (
    <>
      <section className="wrap page-intro">
        <p className="eyebrow">EXPERIMENT 01 / A TASTE OF YOUR DATA</p>
        <h1>Cookie Monster</h1>
        <p>
          Every cookie comes with a little piece of information. Feed the
          monster, then inspect the crumbs.
        </p>
      </section>
      <div className="wrap experiment-body">
        <div className="cookie-layout">
          <section
            className="monster-stage"
            aria-label="Feed the cookie monster"
          >
            <span className="stage-label">ONE COOKIE = ONE DETAIL</span>
            <div
              className={`monster ${eating ? "eating" : ""}`}
              aria-hidden="true"
            >
              <div className="monster-body" />
              <div className="monster-eye left">
                <i />
              </div>
              <div className="monster-eye right">
                <i />
              </div>
              <div className="monster-mouth" />
              <div className="monster-hand" />
              <div className="flying-cookie">
                ●
                <span>
                  • •<br /> •
                </span>
              </div>
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className={`animated-crumb crumb-${i}`} />
              ))}
            </div>
            <p className="monster-speech" aria-live="polite">
              “{message}”
            </p>
            <button
              ref={feedButton}
              className="button feed-button"
              disabled={!next || eating}
              onClick={() => {
                setAnswer("");
                setOpen(true);
              }}
            >
              {eating
                ? "Munching…"
                : next
                  ? "Give him a cookie 🍪"
                  : "All seven cookies eaten"}
            </button>
            <p className="muted">
              {crumbs.length} / {menu.length} details on the menu
            </p>
          </section>
          <section className="panel crumb-panel" aria-labelledby="crumb-title">
            <p className="eyebrow">THE PAPER TRAIL</p>
            <h2 id="crumb-title">What he knows about you</h2>
            <p className="muted">
              Every crumb has a story. Tap or hover a cookie to inspect it.
            </p>
            {crumbs.length ? (
              <>
                <div className="crumb-trail">
                  {crumbs.map((c, i) => (
                    <button
                      key={c.id}
                      className="crumb-token"
                      aria-label={`${c.label}: ${c.value}`}
                      title={`${c.label}: ${c.value}`}
                      onClick={() =>
                        document.getElementById(`detail-${c.id}`)?.focus()
                      }
                    >
                      <span aria-hidden="true">🍪</span>
                      <small>{i + 1}</small>
                    </button>
                  ))}
                </div>
                <dl className="data-list">
                  {crumbs.map((c) => (
                    <div key={c.id} id={`detail-${c.id}`} tabIndex={-1}>
                      <dt>{c.label}</dt>
                      <dd>{c.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <div className="empty-crumbs">
                <span aria-hidden="true">◌</span>
                <p>
                  No crumbs. No details.
                  <br />
                  For now, you’re a mystery.
                </p>
              </div>
            )}
            <button
              className="text-button"
              onClick={forget}
              disabled={!crumbs.length || eating}
            >
              Forget everything
            </button>
          </section>
        </div>
        <div className="notice">
          This experiment stores only the details you accept, in this browser’s
          localStorage. It sends none of them to a server. The popup is part of
          the experiment; it does not set HTTP cookies.
        </div>
        {storageError && (
          <p role="alert" className="notice error">
            {storageError}
          </p>
        )}
        <dialog
          ref={dialog}
          className="cookie-dialog"
          aria-labelledby="cookie-dialog-title"
          onCancel={() => setOpen(false)}
          onClose={() => {
            setOpen(false);
            feedButton.current?.focus();
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              accept();
            }}
          >
            <span className="dialog-cookie" aria-hidden="true">
              🍪
            </span>
            <p className="eyebrow">A VERY SPECIFIC COOKIE NOTICE</p>
            <h2 id="cookie-dialog-title">Accept one more cookie?</h2>
            <p>
              This cookie will give the monster your{" "}
              <strong>{next?.label.toLowerCase()}</strong>.
            </p>
            <p className="muted">{next?.explanation}</p>
            {next && !("read" in next) && (
              <label className="field">
                {next.label}
                <input
                  autoFocus
                  maxLength={80}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={
                    next.id === "nickname"
                      ? "e.g. Captain Biscuit"
                      : "e.g. chocolate chip cookies"
                  }
                />
              </label>
            )}
            <p className="muted">
              Saved on this device only. Declining gives him nothing.
            </p>
            <div className="button-row">
              <button
                className="button secondary"
                type="button"
                onClick={() => {
                  close();
                  setMessage("No cookie? Me respect your boundaries.");
                }}
              >
                Decline
              </button>
              <button
                className="button"
                type="submit"
                disabled={!next || (!("read" in next) && !answer.trim())}
              >
                Accept & feed
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </>
  );
}
