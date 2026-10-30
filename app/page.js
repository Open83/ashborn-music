import Picture from "@/components/Picture";
import PlatformIcon from "@/components/PlatformIcon";
import Wordmark from "@/components/Wordmark";
import { site, hero, message, lyrics, platforms, closing } from "@/lib/site";

const heroSizes = "(min-width: 900px) 83svh, 100vw";

export default function Page() {
  return (
    <>
      <a className="skip" href="#listen">Skip to the listening links</a>

      <main>
        {/* 01 — HERO */}
        <section id="top" className="hero" aria-labelledby="title">
          <div className="hero__art">
            <div className="hero__art-drift">
              <Picture alt={hero.image.alt} sizes={heroSizes} priority />
            </div>
          </div>

          <div className="hero__copy">
            <div className="hero__lockup">
              <p className="hero__artist rise" style={{ "--d": "0.35s" }}>
                <span className="sr-only">Artist: </span>
                <Wordmark />
              </p>
              <h1 id="title" className="hero__title rise" style={{ "--d": "0.55s" }}>
                <span className="sr-only">{site.artist} — </span>
                {site.track}
              </h1>
            </div>
            <p className="hero__descriptor rise" style={{ "--d": "0.8s" }}>{hero.descriptor}</p>
            <p className="hero__support rise" style={{ "--d": "1s" }}>{hero.support}</p>

            <div className="hero__actions rise" style={{ "--d": "0.9s" }}>
              <a className="cta" href="#listen">{hero.primary}</a>
              <ul className="quick" aria-label="Listen directly">
                {platforms.map((p) => (
                  <li key={p.id}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer">
                      <PlatformIcon id={p.id} size={16} />
                      <span>{p.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a className="explore" href="#message">{hero.secondary}</a>
            </div>
          </div>
        </section>

        {/* 02 — THE MESSAGE */}
        <section id="message" className="message" aria-labelledby="message-label">
          {/* Wide screens only: a close detail of the same poster, so the page stays one artwork */}
          <div className="message__art" aria-hidden="true">
            <Picture sizes="46vw" />
          </div>
          <h2 id="message-label" className="label" data-reveal>THE MESSAGE</h2>
          <p className="message__lead" data-reveal>{message.lead}</p>
          <p className="message__middle" data-reveal style={{ "--d": "0.15s" }}>
            {message.middle.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </p>
          <span className="thread" aria-hidden="true" data-reveal />
          <p className="message__close" data-reveal style={{ "--d": "0.1s" }}>
            {message.close.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </p>
        </section>

        {/* 03 — THE LYRICS */}
        <section id="lyrics" className="lyrics" aria-labelledby="lyrics-label">
          <h2 id="lyrics-label" className="label" data-reveal>THE LYRICS</h2>
          <div className="lyrics__list">
            {lyrics.map((f, i) => (
              <figure key={i} className={`frag frag--${i % 2 ? "b" : "a"}`} data-reveal>
                <blockquote lang={f.lang}>
                  <p>
                    {f.lines.map((l, j) => (
                      <span key={j}>{l}</span>
                    ))}
                  </p>
                </blockquote>
              </figure>
            ))}
          </div>
          <p className="lyrics__credit" data-reveal>ASHBORN — MARATHON</p>
        </section>

        {/* 04 — LISTEN */}
        <section id="listen" className="listen" aria-labelledby="listen-title">
          <p className="label" data-reveal>OUT NOW</p>
          <h2 id="listen-title" className="listen__title" data-reveal>Listen to <em>MARATHON</em></h2>
          <ul className="platforms" data-reveal>
            {platforms.map((p) => (
              <li key={p.id}>
                <a className="platform" href={p.url} target="_blank" rel="noopener noreferrer">
                  <PlatformIcon id={p.id} size={30} />
                  <span className="platform__name">{p.name}</span>
                  <span className="platform__go" aria-hidden="true">↗</span>
                  <span className="sr-only"> — opens in a new tab</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* 05 — CLOSING */}
        <section id="closing" className="closing" aria-labelledby="closing-line">
          <div className="closing__art" aria-hidden="true">
            <Picture sizes="100vw" />
          </div>
          <div className="closing__copy">
            <p id="closing-line" className="closing__line" data-reveal>{closing}</p>
            <p className="closing__sign" data-reveal style={{ "--d": "0.2s" }}><Wordmark /></p>
            <ul className="closing__links" data-reveal style={{ "--d": "0.3s" }}>
              {platforms.map((p) => (
                <li key={p.id}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>ASHBORN — MARATHON · Debut single</p>
      </footer>

      {/* Toggled by /enhance.js. Plain HTML, so the page needs no client-side framework. */}
      <a className="pill" href="#listen" data-show="false" tabIndex={-1} aria-hidden="true">LISTEN</a>
    </>
  );
}
