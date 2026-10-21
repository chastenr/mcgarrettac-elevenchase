import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, MoveUpRight } from "lucide-react";
import "./presentation.css";

export const metadata: Metadata = {
  title: "Two ways to experience McGarrett — Homepage concepts",
  description:
    "Explore Precision Comfort and Comfort, Close to Home: two distinct homepage design directions for McGarrett A/C & Heating.",
};

const concepts = [
  {
    number: "01",
    name: "Precision Comfort",
    subtitle: "Confident by design.",
    description:
      "An architectural approach to local service. Bold typography, cinematic photography, and a clear path to the right expertise.",
    qualities: [
      "Bold & architectural",
      "Service-led discovery",
      "Crisp, confident motion",
    ],
    image: "/previews/design-1-desktop.jpg",
    href: "/design-1",
    button: "Explore Design 1",
    theme: "precision",
    label: "Deep navy / clear blue",
  },
  {
    number: "02",
    name: "Comfort, Close to Home",
    subtitle: "A familiar kind of welcome.",
    description:
      "A warm, editorial experience with a personal touch. Genuine people, thoughtful details, and comfort at the heart of the story.",
    qualities: [
      "Warm & editorial",
      "People-first storytelling",
      "Friendly service finder",
    ],
    image: "/previews/design-2-desktop.jpg",
    href: "/design-2",
    button: "Explore Design 2",
    theme: "home",
    label: "Warm ivory / soft sage",
  },
] as const;

export default function Presentation() {
  return (
    <div className="presentation">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="presentation-header">
        <Link href="/" aria-label="McGarrett design presentation">
          <Image
            src="/images/mcgarrett-logo.png"
            alt="McGarrett A/C & Heating"
            width={1280}
            height={719}
            loading="eager"
            className="presentation-logo"
          />
        </Link>
        <span className="presentation-header-label">
          A new perspective on comfort
        </span>
        <span className="presentation-project-label">
          <span />
          Homepage concepts · 2026
        </span>
      </header>
      <main id="main">
        <section className="presentation-intro">
          <div className="presentation-eyebrow">
            <span />
            One local business. Two distinct directions.
          </div>
          <h1>
            Two ways to experience
            <br />
            <em>McGarrett.</em>
          </h1>
          <div className="presentation-intro-bottom">
            <p>
              Explore two homepage concepts and choose
              <br className="presentation-break" /> the direction that feels
              right.
            </p>
            <a href="#concepts" className="presentation-discover">
              Find your direction <ArrowDown size={16} />
            </a>
          </div>
        </section>
        <section
          className="concepts-section"
          id="concepts"
          aria-label="Compare homepage concepts"
        >
          {concepts.map((concept) => (
            <article
              className={`concept-card concept-${concept.theme}`}
              key={concept.number}
            >
              <div className="concept-meta">
                <span className="concept-direction">
                  Direction {concept.number}
                </span>
                <div
                  className="concept-swatches"
                  role="img"
                  aria-label={concept.label}
                >
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <Link
                className="concept-preview-link"
                href={concept.href}
                aria-label={`Preview ${concept.name}`}
              >
                <div className="browser-frame">
                  <div className="browser-chrome">
                    <div className="browser-dots">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span>mcgarrettac.com</span>
                    <MoveUpRight size={11} />
                  </div>
                  <div className="browser-image">
                    <Image
                      src={concept.image}
                      alt={`Actual desktop homepage preview of ${concept.name}`}
                      width={2880}
                      height={7440}
                      quality={90}
                      sizes="(max-width: 767px) 90vw, 46vw"
                      loading="eager"
                    />
                  </div>
                  <div className="preview-open">
                    <span>Explore the full experience</span>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
              <div className="concept-description">
                <span className="concept-number">{concept.number}</span>
                <div>
                  <h2>{concept.name}</h2>
                  <p className="concept-subtitle">{concept.subtitle}</p>
                </div>
              </div>
              <p className="concept-body">{concept.description}</p>
              <ul className="concept-qualities">
                {concept.qualities.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <Link className="concept-button" href={concept.href}>
                <span>{concept.button}</span>
                <ArrowUpRight size={19} />
              </Link>
            </article>
          ))}
        </section>
        <section className="presentation-note">
          <span className="note-line" />
          <p>
            The same McGarrett. A different feeling.
            <br />
            <span>
              Complete homepage experiences, made to explore on every screen.
            </span>
          </p>
          <span className="note-line" />
        </section>
      </main>
      <footer className="presentation-footer">
        <span>McGarrett A/C & Heating</span>
        <span>
          Design exploration <span className="presentation-footer-dot">·</span>{" "}
          Prepared by ElevenChase
        </span>
        <span>Private client presentation</span>
      </footer>
    </div>
  );
}
