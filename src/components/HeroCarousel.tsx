import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "./HeroCarousel.css";

export interface HeroSlide {
  eyebrow: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  onCta: () => void;
  images: string[];
  theme: "blue" | "rose" | "lavender" | "gold";
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (paused || count <= 1 || prefersReducedMotion.current) return;
    const t = setInterval(() => setActive((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;

  const goTo = (i: number) => setActive(((i % count) + count) % count);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button className="hero-carousel-nav hero-carousel-prev" onClick={() => goTo(active - 1)} aria-label="Previous slide">
        <ChevronLeft size={20} />
      </button>

      <div className="hero-carousel-viewport">
        <div className="hero-carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className={`hero-slide hero-slide-${slide.theme}`} aria-hidden={i !== active}>
              <div className="hero-slide-copy">
                <span className="hero-slide-eyebrow"><Sparkles size={13} /> {slide.eyebrow}</span>
                <h2>{slide.heading}</h2>
                <p>{slide.subtext}</p>
                <button
                  className="btn btn-primary hero-slide-cta"
                  onClick={slide.onCta}
                  tabIndex={i !== active ? -1 : undefined}
                >
                  {slide.ctaLabel} <ArrowRight size={16} />
                </button>
              </div>
              <div className="hero-slide-visual">
                {slide.images.map((src, j) => (
                  <img key={j} src={src} alt="" className={`hero-visual-img hero-visual-img-${j}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="hero-carousel-nav hero-carousel-next" onClick={() => goTo(active + 1)} aria-label="Next slide">
        <ChevronRight size={20} />
      </button>

      <div className="hero-carousel-dots" role="tablist" aria-label="Promo slides">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-carousel-dot ${i === active ? "is-active" : ""}`}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
