import { useState } from "react";

const palettes = {
  Meadow: { ink: "#253c30", accent: "#d1ee85", paper: "#eef1e9" },
  Coast: { ink: "#233e58", accent: "#acdce8", paper: "#ebf0f3" },
  Clay: { ink: "#633f35", accent: "#f5bd9e", paper: "#f4ece6" },
};
type Palette = keyof typeof palettes;
type Layout = "Journal" | "Gallery" | "Dashboard";

export default function App() {
  const [palette, setPalette] = useState<Palette>("Meadow");
  const [layout, setLayout] = useState<Layout>("Journal");
  const colors = palettes[palette];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header wrap">
        <a className="brand" href="#" aria-label="Pages Lab home">
          <span className="brand-mark">p.</span>pages lab
          <span className="brand-tag">/ sandbox</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#playground">Playground</a>
          <a href="#foundation">The foundation</a>
          <a
            className="repo-link"
            href="https://github.com/henryletton/pages-sandbox"
          >
            View source <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> EXPERIMENT NO. 001
            </p>
            <h1 id="hero-title">
              A little space.
              <br />A lot of <span>possibility.</span>
            </h1>
            <p className="intro">
              A place to try an idea, make something useful, and see where it
              goes. This is the first page of whatever comes next.
            </p>
            <a className="button" href="#playground">
              Try the playground <span aria-hidden="true">↘</span>
            </a>
            <p className="hero-note">
              Built with curiosity. Published with GitHub Pages.
            </p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-coordinate">FIG. 01 / ROOM TO EXPLORE</span>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="art-tile tile-back" />
            <div className="art-tile tile-front">
              <span>
                Start
                <br />
                somewhere.
              </span>
              <b>↗</b>
            </div>
            <div className="art-circle" />
            <span className="art-bottom">AN OPEN CANVAS, BY DESIGN.</span>
            <span className="art-plus">+</span>
          </div>
        </section>

        <section
          className="playground wrap"
          id="playground"
          aria-labelledby="playground-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / MAKE IT YOURS</p>
              <h2 id="playground-title">
                Same foundation. Different directions.
              </h2>
            </div>
            <p>
              A tiny working demo. Change a few things
              <br className="desktop-break" /> and watch an idea take shape.
            </p>
          </div>
          <div className="workbench">
            <div className="controls">
              <span className="small-label">THE CONTROLS</span>
              <fieldset>
                <legend>Choose a direction</legend>
                <div className="layout-options">
                  {(["Journal", "Gallery", "Dashboard"] as Layout[]).map(
                    (item, i) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={layout === item}
                        onClick={() => setLayout(item)}
                      >
                        <span className="option-number">0{i + 1}</span>
                        {item}
                        <span className="option-check" aria-hidden="true">
                          {layout === item ? "↗" : "+"}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </fieldset>
              <fieldset>
                <legend>Set the mood</legend>
                <div className="swatches">
                  {(Object.keys(palettes) as Palette[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={palette === item}
                      onClick={() => setPalette(item)}
                    >
                      <span style={{ background: palettes[item].ink }} />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <p className="controls-note">
                No reload needed.
                <br />
                That’s React doing its thing.
              </p>
            </div>
            <div className="preview-area" style={{ background: colors.paper }}>
              <div className="browser-frame">
                <div className="browser-bar">
                  <span className="browser-dots">● ● ●</span>
                  <span>your-next-idea.example</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <div
                  className="demo"
                  style={{ color: colors.ink }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="demo-nav">
                    <strong>the {layout.toLowerCase()}.</strong>
                    <span>
                      About <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                  {layout === "Journal" && (
                    <>
                      <p className="demo-eyebrow">NOTES FROM THE EVERYDAY</p>
                      <h3>
                        Good ideas start
                        <br />
                        with a blank page.
                      </h3>
                      <div
                        className="journal-art"
                        style={{ background: colors.accent }}
                      >
                        <span
                          className="journal-sun"
                          style={{ background: colors.ink }}
                        />
                        <span
                          className="journal-hill"
                          style={{ background: colors.ink }}
                        />
                      </div>
                      <div className="demo-caption">
                        <span>A few things worth noticing.</span>
                        <span>01 — 03</span>
                      </div>
                    </>
                  )}
                  {layout === "Gallery" && (
                    <>
                      <p className="demo-eyebrow">A COLLECTION IN PROGRESS</p>
                      <h3>
                        Things made.
                        <br />
                        Ideas explored.
                      </h3>
                      <div className="gallery-grid">
                        {[
                          "Shape study",
                          "New perspective",
                          "Quiet moments",
                        ].map((title, i) => (
                          <div key={title}>
                            <div
                              className={`gallery-piece piece-${i}`}
                              style={{
                                background:
                                  i === 1 ? colors.ink : colors.accent,
                              }}
                            >
                              <span
                                style={{
                                  background:
                                    i === 1 ? colors.accent : colors.ink,
                                }}
                              />
                            </div>
                            <span className="gallery-title">
                              0{i + 1} / {title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {layout === "Dashboard" && (
                    <>
                      <p className="demo-eyebrow">
                        ILLUSTRATIVE DATA / THIS WEEK
                      </p>
                      <h3>
                        A little clarity.
                        <br />A bigger picture.
                      </h3>
                      <div className="metrics">
                        <div style={{ background: colors.accent }}>
                          <span>Ideas captured</span>
                          <strong>24</strong>
                        </div>
                        <div style={{ background: colors.paper }}>
                          <span>Experiments</span>
                          <strong>07</strong>
                        </div>
                      </div>
                      <div
                        className="chart"
                        aria-label="Illustrative activity chart"
                      >
                        <span className="small-label">A WEEK OF MAKING</span>
                        <div className="chart-bars">
                          {[36, 58, 42, 78, 64, 92, 72].map((height, i) => (
                            <div key={i}>
                              <span
                                style={{
                                  height: `${height}%`,
                                  background:
                                    i === 5 ? colors.ink : colors.accent,
                                }}
                              />
                              <small>
                                {["M", "T", "W", "T", "F", "S", "S"][i]}
                              </small>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="preview-caption">
                LIVE PREVIEW{" "}
                <span>
                  {palette} / {layout}
                </span>
              </p>
            </div>
          </div>
        </section>

        <section
          className="foundation wrap"
          id="foundation"
          aria-labelledby="foundation-title"
        >
          <div className="foundation-intro">
            <p className="eyebrow">02 / UNDER THE SURFACE</p>
            <h2 id="foundation-title">
              Simple pieces.
              <br />
              Room to grow.
            </h2>
            <p>
              The content will change. The tools can stay. A familiar foundation
              for the next idea, and the one after that.
            </p>
          </div>
          <dl className="stack-list">
            <div>
              <dt>
                <span>01</span>React + TypeScript
              </dt>
              <dd>
                Reusable building blocks, interactive experiences, and helpful
                checks as things grow.
              </dd>
            </div>
            <div>
              <dt>
                <span>02</span>Vite + plain CSS
              </dt>
              <dd>
                A quick local preview and complete control over how everything
                looks.
              </dd>
            </div>
            <div>
              <dt>
                <span>03</span>GitHub Pages
              </dt>
              <dd>
                Static hosting from this repository. Push a change and the
                publishing workflow takes over.
              </dd>
            </div>
          </dl>
        </section>
        <section className="next-step wrap">
          <span className="eyebrow">WHAT COMES NEXT?</span>
          <h2>That’s the interesting part.</h2>
          <p>
            A portfolio. A useful little tool. Something that doesn’t have a
            name yet.
          </p>
          <a href="https://github.com/henryletton/pages-sandbox">
            Open the repository <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
      <footer className="wrap">
        <a className="brand" href="#">
          <span className="brand-mark">p.</span>pages lab
        </a>
        <p>A work in progress. That’s the point.</p>
        <a href="#main">Back to top ↑</a>
      </footer>
    </>
  );
}
