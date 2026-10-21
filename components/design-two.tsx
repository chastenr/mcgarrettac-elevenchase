"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Flame,
  Snowflake,
} from "lucide-react";
import { RequestLink } from "@/components/shared";
import { useRequest } from "@/components/request-context";
import {
  business,
  propertyTypes,
  type PropertyType,
  type ServiceId,
} from "@/lib/content";

const needs: {
  id: ServiceId;
  label: string;
  title: string;
  description: string;
  icon: typeof Snowflake;
}[] = [
  {
    id: "cooling",
    label: "My AC needs attention.",
    title: "Let’s get back to comfortable.",
    description:
      "From an A/C repair to a new system, tell us what’s happening. We’ll help you take the next step.",
    icon: Snowflake,
  },
  {
    id: "heating",
    label: "I need heating service.",
    title: "A little warmth goes a long way.",
    description:
      "Ask about furnace repairs, maintenance, or installation for your home or property.",
    icon: Flame,
  },
  {
    id: "maintenance",
    label: "I’m planning maintenance.",
    title: "Make routine care part of the plan.",
    description:
      "Ask about annual service contracts and routine care for your heating and cooling equipment.",
    icon: CalendarDays,
  },
  {
    id: "commercial",
    label: "I need help with a business property.",
    title: "Comfort matters at work, too.",
    description:
      "Talk to McGarrett about commercial air conditioning, heating, and air duct services.",
    icon: Building2,
  },
];

export function NeedSelector() {
  const [selected, setSelected] = useState<ServiceId>("cooling");
  const [property, setProperty] = useState<PropertyType>("Residential");
  const { select } = useRequest();
  const reduce = useReducedMotion();
  const need = needs.find((item) => item.id === selected)!;

  function chooseNeed(id: ServiceId) {
    const nextProperty = id === "commercial" ? "Commercial" : property;
    setSelected(id);
    setProperty(nextProperty);
    select(id, nextProperty);
  }

  return (
    <div className="d2-needs-layout">
      <div
        className="d2-needs-choices"
        role="group"
        aria-label="What do you need help with?"
      >
        {needs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={`d2-need-choice${selected === item.id ? " is-selected" : ""}`}
              key={item.id}
              onClick={() => chooseNeed(item.id)}
              aria-pressed={selected === item.id}
              aria-controls="d2-need-details"
            >
              <span className="d2-need-icon">
                <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
              </span>
              <span>{item.label}</span>
              <span className="d2-need-check">
                {selected === item.id ? (
                  <Check size={17} aria-hidden="true" />
                ) : (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </span>
            </button>
          );
        })}
      </div>
      <div className="d2-need-details" id="d2-need-details">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected}
            className="d2-need-description"
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: reduce ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            aria-live="polite"
          >
            <span className="d2-small-label">A GOOD PLACE TO START</span>
            <h3>{need.title}</h3>
            <p>{need.description}</p>
          </motion.div>
        </AnimatePresence>
        <fieldset className="d2-property-choices">
          <legend>What kind of property?</legend>
          <div>
            {propertyTypes.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={property === item}
                className={property === item ? "is-selected" : ""}
                onClick={() => {
                  setProperty(item);
                  select(selected, item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <RequestLink
          className="d2-button"
          service={selected}
          property={property}
        >
          Request service <ArrowRight size={17} aria-hidden="true" />
        </RequestLink>
        <a href={business.tel} className="d2-need-call">
          Prefer a conversation? Call us.
        </a>
      </div>
    </div>
  );
}

const maintenanceTopics = [
  {
    title: "Ask about an annual service contract",
    text: "McGarrett offers annual service contracts. Get in touch to discuss the service available for your property and the current terms.",
  },
  {
    title: "Tell us about your equipment",
    text: "Let us know whether you need care for your air conditioning, furnace, or a commercial HVAC system. Include any questions in your service request.",
  },
  {
    title: "Get the details before you decide",
    text: "Call McGarrett to ask what an annual service contract includes and discuss current terms for your property.",
  },
];

export function MaintenanceTopics() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <div className="d2-maintenance-topics">
      {maintenanceTopics.map((topic, index) => (
        <div className="d2-maintenance-topic" key={topic.title}>
          <h3>
            <button
              aria-expanded={open === index}
              aria-controls={`d2-maintenance-${index}`}
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span>
                <small>0{index + 1}</small>
                {topic.title}
              </span>
              <ChevronDown
                size={21}
                className={open === index ? "is-open" : ""}
                aria-hidden="true"
              />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === index && (
              <motion.div
                id={`d2-maintenance-${index}`}
                initial={{
                  height: reduce ? "auto" : 0,
                  opacity: reduce ? 1 : 0,
                }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.24 }}
              >
                <p>{topic.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
