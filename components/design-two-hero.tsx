"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Building2,
  Flame,
  HeartHandshake,
  Phone,
  Snowflake,
} from "lucide-react";
import { business, type ServiceId } from "@/lib/content";
import { RequestLink } from "./shared";

const comfortOptions = {
  cooling: {
    label: "Keep it cool",
    title: "A little cool goes a long way.",
    detail: "A/C repairs, maintenance & installation",
    image: "/images/technician-outdoor-wide.jpg",
    alt: "McGarrett technician servicing an outdoor air conditioning unit",
    icon: Snowflake,
  },
  heating: {
    label: "Warm things up",
    title: "Make yourself comfortable.",
    detail: "Furnace repairs, maintenance & installation",
    image: "/images/furnace-repair.jpg",
    alt: "McGarrett technician working on furnace equipment",
    icon: Flame,
  },
} as const;
type Comfort = keyof typeof comfortOptions;

export function DesignTwoHero() {
  const [comfort, setComfort] = useState<Comfort>("cooling");
  const reduce = useReducedMotion();
  const tiltX = useSpring(0, { stiffness: 160, damping: 26 });
  const tiltY = useSpring(0, { stiffness: 160, damping: 26 });
  const option = comfortOptions[comfort];
  const Icon = option.icon;

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (
      reduce ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    tiltX.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 2.4);
    tiltY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2.4);
  }

  return (
    <section
      className="d2-hero-stage"
      data-comfort={comfort}
      aria-labelledby="d2-hero-title"
    >
      <div className="container d2-hero-split">
        <div className="d2-hero-introduction">
          <p className="d2-hero-kicker">
            <span />A local family business. A little more comfort.
          </p>
          <h1 id="d2-hero-title">
            <span className="d2-hero-line">A more</span>
            <span className="d2-hero-line">comfortable</span>
            <em className="d2-hero-line d2-hero-handwritten">
              home starts here.
              <svg viewBox="0 0 500 25" fill="none" aria-hidden="true">
                <path d="M5 15C137 1 306 1 491 12M33 24C195 11 362 11 466 19" />
              </svg>
            </em>
          </h1>
          <p className="d2-hero-description">
            Life feels better when your space does. Family-owned heating and
            cooling service for Tomball, Greater Houston, and Northwest Harris
            County.
          </p>
          <div
            className="d2-hero-comfort"
            role="group"
            aria-label="Choose cooling or heating service"
          >
            {(
              Object.entries(comfortOptions) as [
                Comfort,
                (typeof comfortOptions)[Comfort],
              ][]
            ).map(([id, item]) => {
              const OptionIcon = item.icon;
              return (
                <button
                  type="button"
                  key={id}
                  aria-pressed={comfort === id}
                  aria-controls="d2-hero-service-detail"
                  onClick={() => setComfort(id)}
                >
                  {comfort === id && (
                    <motion.span
                      layoutId="hero-comfort-selection"
                      className="d2-hero-comfort-highlight"
                      transition={{
                        duration: reduce ? 0 : 0.26,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  )}
                  <OptionIcon size={17} strokeWidth={1.5} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="d2-hero-actions">
            <RequestLink service={comfort as ServiceId} className="d2-button">
              Request service <ArrowRight size={18} aria-hidden="true" />
            </RequestLink>
            <a className="d2-call-link" href={business.tel}>
              <Phone size={17} aria-hidden="true" />
              Call {business.phone}
            </a>
          </div>
          <a className="d2-business-path" href="#services">
            <Building2 size={17} aria-hidden="true" />
            <span>Comfort for business & multifamily properties, too.</span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div
          className="d2-hero-scene"
          onPointerMove={followPointer}
          onPointerLeave={() => {
            tiltX.set(0);
            tiltY.set(0);
          }}
        >
          <div className="d2-hero-sun" aria-hidden="true" />
          <svg
            className="d2-hero-thread"
            viewBox="0 0 650 650"
            fill="none"
            aria-hidden="true"
          >
            <path d="M564 16C487 8 489 122 567 96C636 72 584 3 530 51C438 133 674 251 601 417C559 511 458 449 517 406C582 358 652 535 539 610C470 657 345 603 305 628" />
          </svg>
          <motion.div
            className="d2-hero-photo-stack"
            style={{ rotateX: tiltX, rotateY: tiltY }}
          >
            <div className="d2-hero-photo-outline" aria-hidden="true" />
            <div className="d2-hero-main-photo">
              <Image
                src="/images/local-home.jpg"
                alt="McGarrett A/C & Heating team beside their company service truck"
                fill
                preload
                sizes="(max-width: 700px) 115vw, (max-width: 1100px) 100vw, 1000px"
              />
            </div>
            <div className="d2-hero-family-note">
              <HeartHandshake size={27} strokeWidth={1.2} aria-hidden="true" />
              <span>
                Family owned.
                <br />
                <em>Personally cared for.</em>
              </span>
            </div>
            <div className="d2-hero-service-card">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  className="d2-hero-inset-photo"
                  key={comfort}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3 }}
                >
                  <Image
                    src={option.image}
                    alt={option.alt}
                    fill
                    sizes="(max-width: 700px) 45vw, 260px"
                    loading="eager"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="d2-hero-inset-icon" aria-hidden="true">
                <Icon size={19} strokeWidth={1.4} />
              </span>
              <span className="d2-hero-inset-caption">
                A familiar team.
                <br />
                For every season.
              </span>
            </div>
          </motion.div>
          <div
            className="d2-hero-service-detail"
            id="d2-hero-service-detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="d2-hero-detail-icon">
              <Icon size={20} strokeWidth={1.3} aria-hidden="true" />
            </span>
            <div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={comfort}
                  initial={{ y: reduce ? 0 : 5, opacity: reduce ? 1 : 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: reduce ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                >
                  <strong>{option.title}</strong>
                  <span>{option.detail}</span>
                </motion.div>
              </AnimatePresence>
            </div>
            <a href="#help" aria-label="Explore heating and cooling services">
              <ArrowDownRight size={24} strokeWidth={1.3} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
