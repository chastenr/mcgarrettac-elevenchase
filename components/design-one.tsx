"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
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

export function ServiceExplorer() {
  const [selected, setSelected] = useState(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
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
        <div
          className="precision-service-panel"
          role="tabpanel"
          id={`service-panel-${current.id}`}
          aria-labelledby={`service-tab-${current.id}`}
          tabIndex={0}
        >
          <div className="service-panel-photo" key={current.image}>
            <Image
              src={current.image}
              alt={current.alt}
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="service-panel-copy">
            <div>
              <span className="eyebrow">0{selected + 1} / Our expertise</span>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
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
              <div
                hidden={!expanded}
                id={`mobile-panel-${s.id}`}
                role="region"
                aria-labelledby={`mobile-service-${s.id}`}
              >
                <div className="mobile-service-photo">
                  <Image src={s.image} alt={s.alt} fill sizes="90vw" />
                </div>
                <p>{s.description}</p>
                <RequestLink service={s.id} className="text-link">
                  Request this service <ArrowUpRight size={18} />
                </RequestLink>
              </div>
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

export function PropertySegments() {
  const [selected, setSelected] = useState(0);
  const item = properties[selected];
  return (
    <div className="precision-properties-grid">
      <div className="property-image">
        <Image
          key={item.image}
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
        />
        <span className="property-image-label">
          <span />
          Built around your space
        </span>
      </div>
      <div className="property-info">
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
              {p.type}
            </button>
          ))}
        </div>
        <div className="property-info-copy" aria-live="polite">
          <p className="eyebrow">For every kind of everyday</p>
          <h3>{item.heading}</h3>
          <p>{item.copy}</p>
          <ul>
            {item.points.map((point) => (
              <li key={point}>
                <Check size={16} />
                {point}
              </li>
            ))}
          </ul>
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
