import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Leaf, Sparkles } from "lucide-react";
import {
  AreaSection,
  ConceptControls,
  ContactSection,
  FAQSection,
  MobileBar,
  RequestLink,
  Reveal,
  SiteFooter,
  SiteHeader,
} from "@/components/shared";
import { MaintenanceTopics, NeedSelector } from "@/components/design-two";
import { DesignTwoHero } from "@/components/design-two-hero";
import "./design-two.css";
import "./hero.css";

export const metadata: Metadata = {
  title: "Comfort, Close to Home — McGarrett A/C & Heating",
  description:
    "A warm, welcoming homepage concept for McGarrett A/C & Heating. Family-owned heating and cooling service for Tomball and Greater Houston.",
};

export default function DesignTwo() {
  return (
    <div className="d2" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ConceptControls active={2} />
      <SiteHeader variant="home" />
      <main id="main-content">
        <DesignTwoHero />

        <div className="d2-facts container" aria-label="About McGarrett">
          <span>
            <Check size={17} aria-hidden="true" />
            Family owned & operated
          </span>
          <span>
            <Check size={17} aria-hidden="true" />
            30+ years of HVAC experience
          </span>
          <span>
            <Check size={17} aria-hidden="true" />
            Residential, commercial & multifamily
          </span>
          <a href="#help">
            Find the help you need <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>

        <section className="d2-help" id="help" aria-labelledby="d2-help-title">
          <div className="container">
            <Reveal>
              <div className="d2-section-intro">
                <div>
                  <p className="d2-eyebrow">LET’S MAKE IT SIMPLE</p>
                  <h2 id="d2-help-title">What can we help with?</h2>
                </div>
                <p>
                  A repair, a fresh start, or a little planning ahead.
                  <br />
                  You’re in the right place.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <NeedSelector />
            </Reveal>
          </div>
        </section>

        <section
          className="d2-story container"
          id="about"
          aria-labelledby="d2-story-title"
        >
          <Reveal className="d2-story-photo-wrap">
            <div className="d2-story-photo">
              <Image
                src="/images/technician-outdoor-wide.jpg"
                alt="A McGarrett technician working on outdoor air conditioning equipment"
                fill
                sizes="(max-width: 700px) 140vw, 55vw"
              />
            </div>
            <div className="d2-experience">
              <span>
                30<span>+</span>
              </span>
              <p>
                years of
                <br />
                HVAC experience
              </p>
            </div>
            <p className="d2-story-caption">
              The experience to help. The people to care.
            </p>
          </Reveal>
          <Reveal className="d2-story-copy">
            <p className="d2-eyebrow">A FAMILY BUSINESS. A LOCAL CONNECTION.</p>
            <h2 id="d2-story-title">
              Good people.
              <br />
              Comfortable spaces.
              <br />
              <em>That’s McGarrett.</em>
            </h2>
            <p>
              We believe good service starts with a real conversation. McGarrett
              A/C & Heating is family owned and operated, with more than 30
              years of HVAC experience.
            </p>
            <p>
              From the place you call home to the property you manage, the
              approach is personal: honest communication, experienced hands, and
              treating customers like family.
            </p>
            <a className="d2-text-link" href="#contact">
              Let’s talk about your space{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </Reveal>
        </section>

        <section
          className="d2-services container"
          id="services"
          aria-labelledby="d2-services-title"
        >
          <Reveal>
            <div className="d2-section-intro">
              <div>
                <p className="d2-eyebrow">FOR EVERY KIND OF EVERYDAY</p>
                <h2 id="d2-services-title">
                  A little more comfort.
                  <br />
                  <em>Wherever you need it.</em>
                </h2>
              </div>
              <p>
                Practical heating and cooling services.
                <br />
                People you can pick up the phone and call.
              </p>
            </div>
          </Reveal>
          <div className="d2-services-grid">
            <Reveal className="d2-service-card d2-cooling">
              <div className="d2-service-photo">
                <Image
                  src="/images/ac-repair.jpg"
                  alt="McGarrett technician servicing air conditioning equipment"
                  fill
                  sizes="(max-width: 700px) 90vw, 55vw"
                />
              </div>
              <div className="d2-service-copy">
                <span className="d2-small-label">01 / KEEP YOUR COOL</span>
                <h3>Air conditioning</h3>
                <p>
                  Repairs, maintenance, and installation. A next step for
                  whatever your A/C needs.
                </p>
                <RequestLink service="cooling" className="d2-service-link">
                  Request cooling service{" "}
                  <ArrowRight size={19} aria-hidden="true" />
                </RequestLink>
              </div>
            </Reveal>
            <Reveal className="d2-service-card d2-heating">
              <div className="d2-service-photo">
                <Image
                  src="/images/furnace-repair.jpg"
                  alt="McGarrett furnace repair and service"
                  fill
                  sizes="(max-width: 700px) 38vw, 22vw"
                />
              </div>
              <div className="d2-service-copy">
                <span className="d2-small-label">02 / WELCOME THE WARMTH</span>
                <h3>Heating</h3>
                <p>
                  Furnace repairs, maintenance, and installation for the cooler
                  days.
                </p>
                <RequestLink service="heating" className="d2-service-link">
                  Heating help <ArrowRight size={18} aria-hidden="true" />
                </RequestLink>
              </div>
            </Reveal>
            <Reveal className="d2-service-card d2-care">
              <div className="d2-service-photo">
                <Image
                  src="/images/ac-maintenance.jpg"
                  alt="Hands inspecting outdoor air conditioning equipment"
                  fill
                  sizes="(max-width: 700px) 38vw, 22vw"
                />
              </div>
              <div className="d2-service-copy">
                <span className="d2-small-label">03 / THINK AHEAD</span>
                <h3>Routine care</h3>
                <p>
                  Plan for your system’s care with an annual service contract.
                </p>
                <RequestLink service="maintenance" className="d2-service-link">
                  Ask about maintenance{" "}
                  <ArrowRight size={18} aria-hidden="true" />
                </RequestLink>
              </div>
            </Reveal>
            <Reveal className="d2-service-card d2-commercial">
              <div className="d2-service-photo">
                <Image
                  src="/images/commercial-heating.jpg"
                  alt="Commercial rooftop heating and air conditioning equipment"
                  fill
                  sizes="(max-width: 700px) 90vw, 36vw"
                />
              </div>
              <div className="d2-service-copy">
                <span className="d2-small-label">
                  04 / COMFORT GETS TO WORK
                </span>
                <h3>
                  Business as
                  <br />
                  <em>comfortable.</em>
                </h3>
                <p>
                  Commercial A/C, heating, and air duct services. Ask us about
                  your commercial or multifamily property.
                </p>
                <RequestLink
                  service="commercial"
                  property="Commercial"
                  className="d2-service-link"
                >
                  Talk commercial HVAC{" "}
                  <ArrowRight size={18} aria-hidden="true" />
                </RequestLink>
              </div>
            </Reveal>
            <Reveal className="d2-service-card d2-air">
              <div className="d2-service-copy">
                <Leaf size={38} strokeWidth={1.2} aria-hidden="true" />
                <span className="d2-small-label">05 / YOUR INDOOR SPACE</span>
                <h3>
                  Let’s talk
                  <br />
                  air quality.
                </h3>
                <p>
                  Explore indoor air quality services for the spaces you spend
                  time in.
                </p>
                <RequestLink service="air-quality" className="d2-service-link">
                  Ask about air quality{" "}
                  <ArrowRight size={18} aria-hidden="true" />
                </RequestLink>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          className="d2-maintenance"
          aria-labelledby="d2-maintenance-title"
        >
          <div className="container d2-maintenance-layout">
            <Reveal className="d2-maintenance-intro">
              <span className="d2-maintenance-icon">
                <Sparkles size={29} strokeWidth={1.2} aria-hidden="true" />
              </span>
              <p className="d2-eyebrow">A LITTLE CARE, A LITTLE FORETHOUGHT</p>
              <h2 id="d2-maintenance-title">
                Make room
                <br />
                for <em>routine care.</em>
              </h2>
              <p>
                You don’t have to wait until something needs attention. Ask
                about an annual service contract for your heating and cooling
                equipment.
              </p>
              <RequestLink service="maintenance" className="d2-button">
                Ask about annual maintenance{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </RequestLink>
            </Reveal>
            <Reveal>
              <MaintenanceTopics />
            </Reveal>
          </div>
        </section>

        <FAQSection variant="home" />
        <AreaSection variant="home" />
        <ContactSection variant="home" />
      </main>
      <SiteFooter variant="home" />
      <MobileBar />
    </div>
  );
}
