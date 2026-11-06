import { useEffect, useRef, useState } from "react";
import CookieMonster from "./experiments/cookie-monster/CookieMonster";
import ConfusingUX from "./experiments/confusing-ux/ConfusingUX";
import CantStop from "./experiments/cant-stop/CantStop";

const experiments = [
  {
    slug: "cookie-monster",
    number: "01",
    name: "Cookie Monster",
    tag: "PRIVACY / PLAY",
    description:
      "One cookie for one little piece of you. See what a hungry monster remembers.",
    color: "cookie",
  },
  {
    slug: "confusing-ux",
    number: "02",
    name: "Confusing UX",
    tag: "INTERACTION / MISCHIEF",
    description: "A collection of interfaces with absolutely the wrong idea.",
    color: "chaos",
  },
  {
    slug: "cant-stop",
    number: "03",
    name: "Can’t Stop",
    tag: "DICE / PUSH YOUR LUCK",
    description:
      "Four dice. Three runners. One more roll is always a tempting idea.",
    color: "dice",
  },
] as const;

function getRoute() {
  return window.location.hash
    .replace(/^#\/?/, "")
    .split("?")[0]
    .replace(/\/$/, "");
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const change = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
      main.current?.focus();
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  const experiment = experiments.find((item) => item.slug === route);
  useEffect(() => {
    document.title = experiment
      ? `${experiment.name} · Pages Lab`
      : "Pages Lab · Experiments in the browser";
  }, [experiment]);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="brand" href="#/" aria-label="Pages Lab home">
          <span className="brand-mark">p.</span>pages lab
          <span className="brand-tag">/ experiments</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#/" aria-current={!route ? "page" : undefined}>
            All experiments
          </a>
          <a
            className="repo-link"
            href="https://github.com/henryletton/pages-sandbox"
          >
            Source ↗
          </a>
        </nav>
      </header>
      {experiment && (
        <nav className="experiment-nav wrap" aria-label="Experiment navigation">
          <a href="#/">← Back to the lab</a>
          <div>
            {experiments.map((item) => (
              <a
                href={`#/${item.slug}`}
                key={item.slug}
                aria-current={route === item.slug ? "page" : undefined}
              >
                {item.number}
                <span> {item.name}</span>
              </a>
            ))}
          </div>
        </nav>
      )}
      <main id="main" ref={main} tabIndex={-1}>
        {!route ? (
          <Home />
        ) : route === "cookie-monster" ? (
          <CookieMonster />
        ) : route === "confusing-ux" ? (
          <ConfusingUX />
        ) : route === "cant-stop" ? (
          <CantStop />
        ) : (
          <section className="wrap page-intro">
            <h1>Experiment not found.</h1>
            <p>That idea hasn’t made it into the lab yet.</p>
            <a className="button" href="#/">
              Back to all experiments
            </a>
          </section>
        )}
      </main>
      <footer className="wrap">
        <a className="brand" href="#/">
          <span className="brand-mark">p.</span>pages lab
        </a>
        <p>Small experiments. Open possibilities.</p>
        <a href="https://github.com/henryletton/pages-sandbox">
          Made in the open ↗
        </a>
      </footer>
    </>
  );
}

function Home() {
  return (
    <div className="wrap home">
      <section className="home-intro">
        <p className="eyebrow">
          <span className="status-dot" /> A COLLECTION OF BROWSER EXPERIMENTS
        </p>
        <h1>
          A little space.
          <br />A few <em>curious ideas.</em>
        </h1>
        <p>
          Some things to play with, poke at, and figure out.
          <br />
          Each experiment is its own little world. Pick a door.
        </p>
        <span className="home-index">
          THE EXPERIMENTS <span>↓</span> 001 — 003
        </span>
      </section>
      <section className="experiment-grid" aria-label="Choose an experiment">
        {experiments.map((item) => (
          <a
            className={`experiment-card ${item.color}`}
            href={`#/${item.slug}`}
            key={item.slug}
          >
            <div className="card-art" aria-hidden="true">
              <span className="art-index">EXPERIMENT {item.number}</span>
              {item.color === "cookie" ? (
                <div className="mini-monster">
                  <i />
                  <i />
                  <b />
                </div>
              ) : item.color === "chaos" ? (
                <div className="mini-chaos">
                  <span>↑ down</span>
                  <span>← right</span>
                  <span>do nothing ↗</span>
                </div>
              ) : (
                <div className="mini-dice">
                  <span>⚄</span>
                  <span>⚂</span>
                </div>
              )}
              <span className="card-arrow">↗</span>
            </div>
            <div className="card-copy">
              <p className="eyebrow">{item.tag}</p>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <span className="card-enter">
                Enter experiment <span>→</span>
              </span>
            </div>
          </a>
        ))}
      </section>
      <aside className="lab-note">
        <span>↳</span>
        <p>
          <strong>Same foundation. Different directions.</strong>
          <br />
          Independent experiments, built with React and TypeScript. No accounts
          needed. Just a browser and a bit of curiosity.
        </p>
      </aside>
    </div>
  );
}
