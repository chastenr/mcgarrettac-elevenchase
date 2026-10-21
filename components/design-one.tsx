"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Snowflake,
  Flame,
  Building2,
  Wind,
} from "lucide-react";
import {
  services,
  propertyTypes,
  type PropertyType,
  type ServiceId,
} from "@/lib/content";
import { RequestLink } from "./shared";

export function HeroIntent() {
  const [service, setService] = useState<ServiceId>("cooling");
  const [property, setProperty] = useState<PropertyType>("Residential");
  return (
    <div className="precision-intent">
      <div className="intent-heading">
        <span className="intent-dot" />
        <p className="eyebrow">Let’s get you comfortable</p>
      </div>
      <div className="intent-fields">
        <label htmlFor="hero-service">
          I need help with
          <select
            aria-label="I need help with"
            id="hero-service"
            value={service}
            onChange={(e) => setService(e.target.value as ServiceId)}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="hero-property">
          At my
          <select
            aria-label="At my"
            id="hero-property"
            value={property}
            onChange={(e) => setProperty(e.target.value as PropertyType)}
          >
            {propertyTypes.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <RequestLink
          service={service}
          property={property}
          className="intent-continue"
        >
          <span>Get started</span>
          <ArrowUpRight size={22} />
        </RequestLink>
      </div>
    </div>
  );
}

const explorerServices = services.slice(0, 4);
const serviceIcons = [Snowflake, Flame, Building2, Wind];
const panelEase = [0.22, 1, 0.36, 1] as const;

function PhotoLayer({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="precision-photo-layer"
      aria-hidden={!present}
      initial={reduce ? false : { opacity: 0, scale: 1.035 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: panelEase }}
    >
      <Image src={src} alt={present ? alt : ""} fill sizes={sizes} />
    </motion.div>
  );
}

function ServiceCopy({ index }: { index: number }) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  const service = explorerServices[index];
  return (
    <motion.div
      className="service-panel-description"
      aria-hidden={!present}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -5 }}
      transition={{ duration: reduce ? 0 : 0.25, ease: panelEase }}
    >
      <span className="eyebrow">0{index + 1} / Our expertise</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </motion.div>
  );
}

export function ServiceExplorer() {
  const [selected, setSelected] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const current = explorerServices[selected];
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = (index + 1) % explorerServices.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = (index + explorerServices.length - 1) % explorerServices.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = explorerServices.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return (
    <>
      <div className="precision-explorer-desktop">
        <LayoutGroup id="precision-service-selection">
        <div
          className="precision-service-index"
          role="tablist"
          aria-label="HVAC services"
          aria-orientation="vertical"
        >
          {explorerServices.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`service-tab-${s.id}`}
                role="tab"
                aria-selected={selected === i}
                aria-controls={`service-panel-${s.id}`}
                tabIndex={selected === i ? 0 : -1}
                className={selected === i ? "selected" : ""}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => navigate(e, i)}
              >
                {selected === i && (
                  <motion.span
                    className="service-row-active"
                    aria-hidden="true"
                    layoutId={reduce ? undefined : "active-service"}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 38 }}
                  />
                )}
                <span className="service-row-number">0{i + 1}</span>
                <Icon className="service-row-icon" size={23} />
                <span>{s.title}</span>
                <ArrowUpRight size={22} />
              </button>
            );
          })}
          <p className="service-index-note">
            Repairs. Maintenance. Installation.
            <br />
            Practical help for the space you depend on.
          </p>
        </div>
        </LayoutGroup>
        <div
          className="precision-service-panel"
          role="tabpanel"
          id={`service-panel-${current.id}`}
          aria-labelledby={`service-tab-${current.id}`}
          tabIndex={0}
        >
          <div className="service-panel-photo">
            <AnimatePresence initial={false}>
              <PhotoLayer key={current.image} src={current.image} alt={current.alt} sizes="(max-width: 900px) 100vw, 48vw" />
            </AnimatePresence>
          </div>
          <div className="service-panel-copy">
            <div className="service-panel-copy-stage" aria-live="polite">
              <AnimatePresence initial={false}>
                <ServiceCopy key={current.id} index={selected} />
              </AnimatePresence>
            </div>
            <RequestLink service={current.id} className="text-link">
              Request this service <ArrowUpRight size={18} />
            </RequestLink>
          </div>
        </div>
      </div>
      <div className="precision-explorer-mobile">
        {explorerServices.map((s, i) => {
          const expanded = mobileOpen === i;
          return (
            <div className="precision-mobile-service" key={s.id}>
              <button
                id={`mobile-service-${s.id}`}
                aria-expanded={expanded}
                aria-controls={`mobile-panel-${s.id}`}
                onClick={() => setMobileOpen(expanded ? null : i)}
              >
                <span>0{i + 1}</span>
                <strong>{s.title}</strong>
                <span className="accordion-sign">{expanded ? "−" : "+"}</span>
              </button>
              <motion.div
                className="mobile-service-panel"
                id={`mobile-panel-${s.id}`}
                role="region"
                aria-labelledby={`mobile-service-${s.id}`}
                aria-hidden={!expanded}
                inert={!expanded}
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.32, ease: panelEase }}
              >
                <div className="mobile-service-content">
                <div className="mobile-service-photo">
                  <Image src={s.image} alt={s.alt} fill sizes="90vw" />
                </div>
                <p>{s.description}</p>
                <RequestLink service={s.id} className="text-link">
                  Request this service <ArrowUpRight size={18} />
                </RequestLink>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const properties = [
  {
    type: "Residential" as const,
    heading: "For the place you call home.",
    copy: "From an A/C that needs attention to a new furnace installation, get help with the systems that keep your household comfortable.",
    image: "/images/outdoor-condenser.jpg",
    alt: "Outdoor air conditioning condenser beside a home",
    points: [
      "Air conditioning & furnace service",
      "Repairs, maintenance & installation",
    ],
  },
  {
    type: "Commercial" as const,
    heading: "Comfort belongs at work, too.",
    copy: "Heating, cooling, and air duct services for the spaces where your business operates. Tell us about your property and the help you need.",
    image: "/images/commercial-heating.jpg",
    alt: "Rooftop commercial HVAC equipment",
    points: ["Commercial heating & cooling", "Air duct services"],
  },
  {
    type: "Multifamily" as const,
    heading: "More homes. The same care.",
    copy: "Bring experienced HVAC support to your multifamily property. Connect with McGarrett about repairs, maintenance, or installation.",
    image: "/images/ac-installation.jpg",
    alt: "A McGarrett technician working on HVAC equipment",
    points: ["Multifamily HVAC experience", "Support for property managers"],
  },
];

function PropertyCopy({ index }: { index: number }) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  const item = properties[index];
  return (
    <motion.div
      className="property-info-copy"
      aria-hidden={!present}
      initial={reduce ? false : { opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: reduce ? 0 : -8 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: panelEase }}
    >
      <p className="eyebrow">For every kind of everyday</p>
      <h3>{item.heading}</h3>
      <p>{item.copy}</p>
      <ul>
        {item.points.map((point) => (
          <li key={point}><Check size={16} aria-hidden="true" />{point}</li>
        ))}
      </ul>
    </motion.div>
  );
}

export function PropertySegments() {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const item = properties[selected];
  return (
    <div className="precision-properties-grid">
      <div className="property-image">
        <AnimatePresence initial={false}>
          <PhotoLayer key={item.image} src={item.image} alt={item.alt} sizes="(max-width: 800px) 100vw, 50vw" />
        </AnimatePresence>
        <span className="property-image-label">
          <span />
          Built around your space
        </span>
      </div>
      <div className="property-info">
        <LayoutGroup id="precision-property-selection">
        <div
          className="property-segments"
          role="group"
          aria-label="Choose property type"
        >
          {properties.map((p, i) => (
            <button
              key={p.type}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              <span>{p.type}</span>
              {selected === i && <motion.span className="property-segment-active" aria-hidden="true" layoutId={reduce ? undefined : "active-property"} transition={{ duration: reduce ? 0 : 0.3, ease: panelEase }} />}
            </button>
          ))}
        </div>
        </LayoutGroup>
        <div className="property-copy-stage" aria-live="polite">
          <AnimatePresence initial={false}>
            <PropertyCopy key={item.type} index={selected} />
          </AnimatePresence>
        </div>
        <RequestLink
          property={item.type}
          service={item.type === "Commercial" ? "commercial" : undefined}
          className="text-link"
        >
          Let’s talk about your property <ArrowRight size={18} />
        </RequestLink>
      </div>
    </div>
  );
}
