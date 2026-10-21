import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  Phone,
  ArrowDown,
  ShieldCheck,
  Users,
  MapPin,
  Wrench,
  CalendarDays,
} from "lucide-react";
import { business } from "@/lib/content";
import {
  ConceptControls,
  SiteHeader,
  SiteFooter,
  ContactSection,
  FAQSection,
  AreaSection,
  Reveal,
  RequestLink,
  MobileBar,
} from "@/components/shared";
import {
  HeroIntent,
  ServiceExplorer,
  PropertySegments,
} from "@/components/design-one";
import "./design-one.css";

export const metadata: Metadata = {
  title: "Precision Comfort — McGarrett Design 1",
  description:
    "A confident, architectural homepage concept for McGarrett A/C & Heating. Heating and cooling for homes, businesses, and multifamily properties in Greater Houston.",
};

export default function PrecisionComfort() {
  return (
    <div className="d1" id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ConceptControls active={1} />
      <SiteHeader variant="precision" />
      <main id="main">
        <section className="precision-hero" aria-labelledby="hero-heading">
          <Image
            className="precision-hero-photo"
            src="/images/ac-repair.jpg"
            alt="McGarrett technician inspecting heating and cooling equipment"
            fill
            preload
            sizes="100vw"
          />
          <div className="precision-hero-shade" />
          <div className="container precision-hero-inner">
            <div className="precision-hero-copy">
              <p className="eyebrow">
                <span className="blue-line" />
                Tomball roots. Greater Houston reach.
              </p>
              <h1 id="hero-heading">
                Comfort for
                <br />
                your home.
                <br />
                <span>
                  Confidence for
                  <br />
                  your business.
                </span>
              </h1>
              <p className="precision-hero-description">
                Heating and cooling, handled with care. Repairs, maintenance,
                and installation for homes and properties across Greater
                Houston.
              </p>
              <div className="precision-hero-actions">
                <RequestLink className="button">
                  Request service <ArrowUpRight />
                </RequestLink>
                <a className="hero-call" href={business.tel}>
                  <Phone size={17} />
                  <span>Call {business.phone}</span>
                </a>
              </div>
              <p className="hero-small-fact">
                <span />
                Family-owned & operated
                <span className="fact-divider" />
                30+ years of HVAC experience
              </p>
            </div>
            <div className="precision-hero-bottom">
              <a href="#services" className="hero-discover">
                <span>Explore our expertise</span>
                <ArrowDown size={18} />
              </a>
              <HeroIntent />
            </div>
          </div>
          <div className="hero-side-note" aria-hidden="true">
            Honest service. Reliable comfort.
          </div>
        </section>
        <section className="precision-trust" aria-label="About McGarrett">
          <div className="container">
            {[
              {
                icon: Users,
                title: "Family-owned",
                sub: "A personal approach",
              },
              { icon: Wrench, title: "30+ years", sub: "Of HVAC experience" },
              {
                icon: MapPin,
                title: "Locally focused",
                sub: "Tomball & Greater Houston",
              },
              {
                icon: ShieldCheck,
                title: "Every kind of property",
                sub: "Residential · Commercial · Multifamily",
              },
            ].map(({ icon: Icon, title, sub }) => (
              <div className="precision-trust-item" key={title}>
                <Icon size={24} strokeWidth={1.4} />
                <div>
                  <strong>{title}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="precision-services precision-section" id="services">
          <div className="container">
            <Reveal className="precision-section-heading">
              <div>
                <p className="eyebrow section-kicker">
                  01 / Built for your comfort
                </p>
                <h2>
                  The right expertise.
                  <br />
                  Right when you need it.
                </h2>
              </div>
              <p>
                One local team for your heating and cooling needs. Find the
                service that fits your space.
              </p>
            </Reveal>
            <ServiceExplorer />
          </div>
        </section>
        <section
          className="precision-property-section precision-section"
          id="properties"
        >
          <div className="container">
            <Reveal className="precision-section-heading">
              <div>
                <p className="eyebrow section-kicker">
                  02 / Wherever life happens
                </p>
                <h2>
                  Different spaces.
                  <br />
                  One familiar name.
                </h2>
              </div>
              <p>
                Homeowners, business owners, and property managers. Your space
                matters to us.
              </p>
            </Reveal>
            <PropertySegments />
          </div>
        </section>
        <section className="precision-story precision-section" id="about">
          <div className="container precision-story-grid">
            <Reveal className="precision-story-photo">
              <Image
                src="/images/local-home.jpg"
                alt="McGarrett company representatives beside their branded service truck"
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <div className="story-photo-note">
                <span className="story-note-rule" />
                <span>Your local heating & cooling company</span>
              </div>
            </Reveal>
            <Reveal className="precision-story-copy">
              <p className="eyebrow section-kicker">03 / Meet McGarrett</p>
              <h2>
                Experienced hands.
                <br />A family approach.
              </h2>
              <p>
                We’re a family-owned and operated HVAC company based in
                Northwest Harris County, serving Tomball and the Greater Houston
                area.
              </p>
              <p>
                With more than 30 years of HVAC experience across residential,
                commercial, and multifamily systems, we bring practical
                knowledge to every conversation. Our family-business promise is
                simple: honest communication and treating customers like family.
              </p>
              <div className="story-experience">
                <strong>
                  30<span>+</span>
                </strong>
                <div>
                  Years of hands-on
                  <br />
                  HVAC experience
                </div>
              </div>
              <RequestLink className="text-link">
                Get to know your local team <ArrowUpRight size={18} />
              </RequestLink>
            </Reveal>
          </div>
        </section>
        <section className="precision-maintenance" id="maintenance">
          <div className="container precision-maintenance-grid">
            <div className="maintenance-symbol">
              <CalendarDays size={48} strokeWidth={1} />
              <span className="eyebrow">
                A little planning.
                <br />A familiar team.
              </span>
            </div>
            <Reveal>
              <p className="eyebrow">04 / Think ahead</p>
              <h2>
                Make room for
                <br />
                routine care.
              </h2>
              <p>
                Keep maintenance on your calendar. Ask about McGarrett’s annual
                service contracts for your heating and cooling equipment.
              </p>
            </Reveal>
            <RequestLink service="maintenance" className="button button-light">
              Ask about maintenance <ArrowUpRight />
            </RequestLink>
          </div>
        </section>
        <AreaSection variant="precision" />
        <FAQSection variant="precision" />
        <ContactSection variant="precision" />
      </main>
      <SiteFooter variant="precision" />
      <MobileBar />
    </div>
  );
}
