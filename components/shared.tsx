"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  Menu,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { stagger, useAnimate, useInView, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  business,
  faqs,
  propertyTypes,
  services,
  type PropertyType,
  type ServiceId,
} from "@/lib/content";
import { useRequest } from "./request-context";
import "./shared.css";

type Variant = "precision" | "home";
const navigation = [
  ["Services", "#services"],
  ["Our company", "#about"],
  ["Service area", "#service-area"],
  ["FAQs", "#faq"],
] as const;
const homeNavigation = [
  ["Our story", "#about"],
  ["How we help", "#services"],
  ["Helpful answers", "#faq"],
  ["Around Houston", "#service-area"],
] as const;

export function ConceptControls({ active }: { active: 1 | 2 }) {
  return (
    <nav
      className={`sh-concepts sh-concepts--${active}`}
      aria-label="Homepage design presentation"
    >
      <div className="sh-shell sh-concepts__inner">
        <Link href="/" className="sh-concepts__all">
          <ArrowUpRight size={12} aria-hidden="true" /> All designs
        </Link>
        <span className="sh-concepts__label">
          McGarrett · Homepage concepts
        </span>
        <div className="sh-concepts__links">
          <Link
            href="/design-1"
            aria-current={active === 1 ? "page" : undefined}
          >
            Design 1
            <span className="sh-concepts__title"> / Precision Comfort</span>
          </Link>
          <Link
            href="/design-2"
            aria-current={active === 2 ? "page" : undefined}
          >
            Design 2<span className="sh-concepts__title"> / Close to Home</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function RequestLink({
  children,
  service,
  property,
  className = "",
}: {
  children: ReactNode;
  service?: ServiceId;
  property?: PropertyType;
  className?: string;
}) {
  const { select } = useRequest();
  return (
    <a
      href="#contact"
      className={`sh-request-link ${className}`}
      onClick={() => select(service, property)}
    >
      {children}
    </a>
  );
}

export function SiteHeader({ variant }: { variant: Variant }) {
  const links = variant === "home" ? homeNavigation : navigation;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header
      className={`sh-header sh-header--${variant}${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}
    >
      <div className="sh-shell sh-header__main">
        <a
          href="#top"
          className="sh-logo"
          aria-label="McGarrett A/C & Heating, back to top"
        >
          <Image
            src="/images/mcgarrett-logo.png"
            alt="McGarrett A/C & Heating"
            width={1280}
            height={719}
            loading="eager"
            sizes="(max-width: 600px) 136px, 164px"
          />
        </a>
        <nav aria-label="Main navigation" className="sh-header__desktop">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="sh-header__actions">
          <a className="sh-header__phone" href={business.tel}>
            <Phone size={15} aria-hidden="true" />
            <span>{business.phone}</span>
          </a>
          <RequestLink className="sh-button sh-button--solid sh-header__request">
            Request service
            <ArrowUpRight size={16} aria-hidden="true" />
          </RequestLink>
        </div>
        <button
          ref={toggle}
          className="sh-menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav
          id={menuId}
          className="sh-header__mobile sh-shell"
          aria-label="Mobile navigation"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
          <a href="#contact">
            Request service
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={business.tel}>
            Call {business.phone}
            <Phone size={16} aria-hidden="true" />
          </a>
        </nav>
      )}
    </header>
  );
}

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inView = useInView(scope, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -32px 0px",
  });
  const entered = useRef(false);

  useEffect(() => {
    const element = scope.current;
    if (!element || !inView || entered.current) return;
    entered.current = true;

    // No initial styles are written during render: the complete content is
    // visible in server HTML, without JavaScript, and for reduced motion.
    if (reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const items = Array.from(element.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.tagName !== "IMG" &&
        !child.querySelector("img") &&
        !child.classList.contains("sh-reveal"),
    );
    const images = Array.from(element.querySelectorAll("img")).filter(
      (image) => image.closest(".sh-reveal") === element,
    );
    const siblings = Array.from(element.parentElement?.children ?? []).filter(
      (child) => child.classList.contains("sh-reveal"),
    );
    const groupDelay = Math.min(Math.max(siblings.indexOf(element), 0), 3) * 0.06;
    const animations: ReturnType<typeof animate>[] = [];
    const clearStyles = () => {
      [...items, ...images].forEach((item) => {
        item.style.removeProperty("opacity");
        item.style.removeProperty("transform");
      });
    };

    element.classList.add("sh-reveal--entered");
    if (items.length)
      animations.push(
        animate(
          items,
          { opacity: [0.24, 1], y: [28, 0] },
          {
            duration: 0.62,
            delay: stagger(0.07, { startDelay: groupDelay }),
            ease: [0.22, 1, 0.36, 1],
          },
        ),
      );
    if (images.length)
      animations.push(
        animate(
          images,
          { opacity: [0.65, 1], scale: [1.065, 1] },
          {
            duration: 0.9,
            delay: groupDelay,
            ease: [0.22, 1, 0.36, 1],
          },
        ),
      );

    // Motion commits its final DOM values in a render frame after completion.
    // Clear on the following frame so image hover transforms remain available.
    void Promise.all(animations).then(() => requestAnimationFrame(clearStyles));
    return () => {
      animations.forEach((animation) => animation.complete());
      clearStyles();
    };
  }, [animate, inView, reduce, scope]);

  return (
    <div ref={scope} className={`sh-reveal ${className}`}>
      {children}
    </div>
  );
}

export function FAQSection({ variant }: { variant: Variant }) {
  return (
    <section
      id="faq"
      className={`sh-faq sh-section sh-faq--${variant}`}
      aria-labelledby="faq-title"
    >
      <div className="sh-shell sh-faq__layout">
        <Reveal className="sh-faq__intro">
          <p className="sh-eyebrow">A little clarity</p>
          <h2 id="faq-title">
            Good questions.
            <br />
            <span>Helpful answers.</span>
          </h2>
          <p>
            Here are a few things to know before you get in touch. For questions
            about your specific system, give us a call.
          </p>
          <a className="sh-text-link" href={business.tel}>
            Talk with McGarrett <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </Reveal>
        <Reveal className="sh-faq__questions">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="sh-faq__item">
              <summary>
                <span className="sh-faq__number">0{index + 1}</span>
                <span>{faq.question}</span>
                <Plus className="sh-faq__plus" size={19} aria-hidden="true" />
              </summary>
              <div className="sh-faq__answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function AreaIllustration({ warm }: { warm: boolean }) {
  return (
    <div className="sh-area__illustration">
      <svg
        viewBox="0 0 620 420"
        role="img"
        aria-labelledby={`area-title-${warm ? "home" : "precision"}`}
      >
        <title id={`area-title-${warm ? "home" : "precision"}`}>
          Decorative illustration of McGarrett’s service regions, not a coverage
          map
        </title>
        <defs>
          <pattern
            id={`area-grid-${warm ? "home" : "precision"}`}
            width="38"
            height="38"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M38 0H0V38"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".075"
            />
          </pattern>
        </defs>
        <rect
          width="620"
          height="420"
          fill={`url(#area-grid-${warm ? "home" : "precision"})`}
        />
        <path
          className="sh-area__road"
          d="M-20 310C110 286 110 198 222 180S390 192 440 96S545 18 640 37M68-20C85 82 220 83 250 177S257 366 351 440M-20 89C133 113 178 71 280 111S397 290 640 301"
        />
        <path
          className="sh-area__road sh-area__road--small"
          d="M-20 240C130 243 174 297 297 266S456 219 644 241M143-20C140 90 351 50 361 158S410 365 535 440M-20 369C143 348 161 401 285 353S507 301 640 366"
        />
        <circle cx="250" cy="177" r="53" className="sh-area__halo" />
        <circle cx="250" cy="177" r="9" className="sh-area__dot" />
        <circle
          cx="365"
          cy="284"
          r="6"
          className="sh-area__dot sh-area__dot--secondary"
        />
        <text x="271" y="161" className="sh-area__city">
          Tomball
        </text>
        <text x="169" y="233" className="sh-area__region">
          NORTHWEST HARRIS COUNTY
        </text>
        <text x="384" y="290" className="sh-area__city sh-area__city--small">
          Greater Houston
        </text>
        <path d="M549 69V39M541 47L549 39 557 47" className="sh-area__north" />
        <text x="543" y="88" className="sh-area__n">
          N
        </text>
      </svg>
      <p>
        <span aria-hidden="true">↗</span> Regional illustration · not a service
        boundary
      </p>
    </div>
  );
}

export function AreaSection({ variant }: { variant: Variant }) {
  return (
    <section
      id="service-area"
      className={`sh-area sh-section sh-area--${variant}`}
      aria-labelledby="service-area-title"
    >
      <div className="sh-shell sh-area__layout">
        <Reveal className="sh-area__visual">
          <AreaIllustration warm={variant === "home"} />
        </Reveal>
        <Reveal className="sh-area__copy">
          <p className="sh-eyebrow">Local service. Familiar places.</p>
          <h2 id="service-area-title">
            At home in
            <br />
            <span>Greater Houston.</span>
          </h2>
          <p>
            Heating and cooling service for homes, businesses, and multifamily
            properties in Tomball, the Greater Houston area, and Northwest
            Harris County.
          </p>
          <div className="sh-area__labels">
            <span>Tomball</span>
            <span>Greater Houston</span>
            <span>Northwest Harris County</span>
          </div>
          <p className="sh-area__invitation">
            Not sure if we cover your location? Call us.
          </p>
          <a className="sh-text-link" href={business.tel}>
            {business.phone}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

type ContactDraft = {
  name: string;
  phone: string;
  email: string;
  location: string;
  description: string;
};
type FormDraft = ContactDraft & { service: string; property: string };
type ErrorKey = "name" | "phone" | "email" | "service" | "location";

function RequestForm() {
  const { selection, select } = useRequest();
  const formId = useId();
  const [details, setDetails] = useState<ContactDraft>({
    name: "",
    phone: "",
    email: "",
    location: "",
    description: "",
  });
  const draft: FormDraft = {
    ...details,
    service: selection.service ?? "",
    property: selection.property ?? "",
  };
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [success, setSuccess] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const change = (field: keyof FormDraft, value: string) => {
    if (field !== "service" && field !== "property")
      setDetails((previous) => ({ ...previous, [field]: value }));
    setSuccess(false);
    if (errors[field as ErrorKey])
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (field === "service" && value) select(value as ServiceId);
    if (field === "property" && value) select(undefined, value as PropertyType);
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<ErrorKey, string>> = {};
    if (!draft.name.trim()) next.name = "Enter your name.";
    const phoneDigits = draft.phone.replace(/\D/g, "");
    if (
      !/^[+()\d.\-\s]+$/.test(draft.phone) ||
      !(
        phoneDigits.length === 10 ||
        (phoneDigits.length === 11 && phoneDigits[0] === "1")
      )
    )
      next.phone = "Enter a 10-digit US phone number, with an optional +1.";
    if (
      draft.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
    )
      next.email = "Enter a valid email address or leave it blank.";
    if (!services.some((service) => service.id === draft.service))
      next.service = "Choose the service you need.";
    const location = draft.location.trim();
    if (
      location &&
      /^[\d\s-]+$/.test(location) &&
      !/^\d{5}(?:-?\d{4})?$/.test(location)
    )
      next.location = "Enter a 5-digit or 9-digit ZIP code, or a city name.";
    setErrors(next);
    setSuccess(false);
    if (Object.keys(next).length)
      requestAnimationFrame(() => summaryRef.current?.focus());
    else {
      setSuccess(true);
      requestAnimationFrame(() => successRef.current?.focus());
    }
  };
  const inputProps = (field: ErrorKey) => ({
    id: `${formId}-${field}`,
    name: field,
    value: draft[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      change(field, event.target.value),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${formId}-${field}-error` : undefined,
  });
  const error = (field: ErrorKey) =>
    errors[field] ? (
      <span id={`${formId}-${field}-error`} className="sh-form__error">
        {errors[field]}
      </span>
    ) : null;
  return (
    <form className="sh-form" noValidate onSubmit={submit}>
      <div className="sh-form__heading">
        <h3>Tell us what you need.</h3>
        <span>Fields marked * are required.</span>
      </div>
      {Object.values(errors).some(Boolean) && (
        <div
          className="sh-form__summary"
          role="alert"
          tabIndex={-1}
          ref={summaryRef}
        >
          <strong>Please check your request.</strong>
          <ul>
            {(Object.entries(errors) as [ErrorKey, string][])
              .filter(([, message]) => message)
              .map(([field, message]) => (
                <li key={field}>
                  <a href={`#${formId}-${field}`}>{message}</a>
                </li>
              ))}
          </ul>
        </div>
      )}
      <div className="sh-form__grid">
        <div className="sh-form__field">
          <label htmlFor={`${formId}-name`}>
            Your name <span>*</span>
          </label>
          <input
            {...inputProps("name")}
            autoComplete="name"
            required
            placeholder="Full name"
          />
          {error("name")}
        </div>
        <div className="sh-form__field">
          <label htmlFor={`${formId}-phone`}>
            Phone number <span>*</span>
          </label>
          <input
            {...inputProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="(346) 555-0123"
          />
          {error("phone")}
        </div>
        <div className="sh-form__field">
          <label htmlFor={`${formId}-email`}>
            Email <span className="sh-form__optional">(optional)</span>
          </label>
          <input
            {...inputProps("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          {error("email")}
        </div>
        <div className="sh-form__field">
          <label htmlFor={`${formId}-service`}>
            Service needed <span>*</span>
          </label>
          <select
            id={`${formId}-service`}
            name="service"
            value={draft.service}
            onChange={(event) => change("service", event.target.value)}
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={
              errors.service ? `${formId}-service-error` : undefined
            }
            required
          >
            <option value="" disabled>
              Choose a service
            </option>
            {services.map((service) => (
              <option value={service.id} key={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          {error("service")}
        </div>
        <div className="sh-form__field">
          <label htmlFor={`${formId}-property`}>
            Property type <span className="sh-form__optional">(optional)</span>
          </label>
          <select
            id={`${formId}-property`}
            name="property"
            value={draft.property}
            onChange={(event) => change("property", event.target.value)}
          >
            <option value="" disabled>
              Choose a property type
            </option>
            {propertyTypes.map((property) => (
              <option key={property}>{property}</option>
            ))}
          </select>
        </div>
        <div className="sh-form__field">
          <label htmlFor={`${formId}-location`}>
            City or ZIP code{" "}
            <span className="sh-form__optional">(optional)</span>
          </label>
          <input
            {...inputProps("location")}
            autoComplete="postal-code"
            placeholder="Tomball or 77375"
          />
          {error("location")}
        </div>
        <div className="sh-form__field sh-form__field--full">
          <label htmlFor={`${formId}-description`}>
            How can we help?{" "}
            <span className="sh-form__optional">(optional)</span>
          </label>
          <textarea
            id={`${formId}-description`}
            name="description"
            rows={3}
            value={draft.description}
            onChange={(event) => change("description", event.target.value)}
            placeholder="A few details about your heating or cooling needs"
          />
        </div>
      </div>
      <div className="sh-form__submit">
        <p>This is a design preview. Requests are not sent.</p>
        <button type="submit" className="sh-button sh-button--solid">
          Preview service request
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </div>
      {success && (
        <div
          className="sh-form__success"
          role="status"
          tabIndex={-1}
          ref={successRef}
        >
          <Check size={21} aria-hidden="true" />
          <p>
            Preview only — your request has not been sent. Call 346-946-7577 to
            contact McGarrett.
          </p>
        </div>
      )}
    </form>
  );
}

export function ContactSection({ variant }: { variant: Variant }) {
  return (
    <section
      id="contact"
      className={`sh-contact sh-section sh-contact--${variant}`}
      aria-labelledby="contact-title"
    >
      <div className="sh-shell sh-contact__layout">
        <Reveal className="sh-contact__intro">
          <p className="sh-eyebrow">Start a conversation</p>
          <h2 id="contact-title">
            {variant === "precision" ? (
              <>
                Your comfort.
                <br />
                <span>Our next conversation.</span>
              </>
            ) : (
              <>
                Let’s make your
                <br />
                <span>space comfortable.</span>
              </>
            )}
          </h2>
          <p>
            Tell us what’s happening at your home or property. For service
            inquiries and current availability, call McGarrett directly.
          </p>
          <a className="sh-contact__phone" href={business.tel}>
            <Phone size={25} aria-hidden="true" />
            {business.phone}
            <ArrowUpRight size={21} aria-hidden="true" />
          </a>
          <a className="sh-contact__email" href={business.mailto}>
            {business.email}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <div className="sh-contact__hours">
            <Clock3 size={19} aria-hidden="true" />
            <div>
              <strong>Office hours</strong>
              <p>
                {business.hours}
                <br />
                {business.onCall}
              </p>
              <span>Call to ask about after-hours availability.</span>
            </div>
          </div>
        </Reveal>
        <Reveal className="sh-contact__form-reveal">
          <RequestForm />
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({ variant }: { variant: Variant }) {
  return (
    <footer className={`sh-footer sh-footer--${variant}`}>
      <div className="sh-shell">
        <Reveal className="sh-footer__top">
          <div className="sh-footer__brand">
            <a
              href="#top"
              className="sh-logo"
              aria-label="McGarrett A/C & Heating, back to top"
            >
              <Image
                src="/images/mcgarrett-logo.png"
                alt="McGarrett A/C & Heating"
                width={1280}
                height={719}
                sizes="190px"
              />
            </a>
            <p>
              Comfort for the places
              <br />
              that matter to you.
            </p>
            <span>
              Family-owned & operated.
              <br />
              Serving homes and properties around Greater Houston.
            </span>
          </div>
          <div className="sh-footer__links">
            <h3>Find your way</h3>
            {navigation.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
            <a href="#contact">Request service</a>
          </div>
          <div className="sh-footer__links">
            <h3>Heating & cooling</h3>
            {services.map((service) => (
              <RequestLink key={service.id} service={service.id}>
                {service.title}
              </RequestLink>
            ))}
          </div>
          <div className="sh-footer__contact">
            <h3>Let’s talk comfort</h3>
            <a className="sh-footer__phone" href={business.tel}>
              {business.phone}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a href={business.mailto}>{business.email}</a>
            <p>
              {business.hours}
              <br />
              {business.onCall}
            </p>
            <span>
              <MapPin size={15} aria-hidden="true" />
              Tomball · Greater Houston
              <br />
              Northwest Harris County
            </span>
          </div>
        </Reveal>
        <div className="sh-footer__bottom">
          <span>© {new Date().getFullYear()} McGarrett A/C & Heating</span>
          <span>License identifier: {business.license}</span>
          <a href="#top">
            Back to top <ArrowDown size={13} aria-hidden="true" />
          </a>
        </div>
        <p className="sh-footer__preview">
          Homepage design presentation · Preview only
        </p>
      </div>
    </footer>
  );
}

export function MobileBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => {
      const active = document.activeElement;
      setHidden(
        active instanceof HTMLElement &&
          /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName),
      );
    };
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);
  return (
    <div
      className={`sh-mobile-bar${hidden ? " is-hidden" : ""}`}
      aria-label="Quick contact actions"
    >
      <a href={business.tel}>
        <Phone size={18} aria-hidden="true" />
        Call
      </a>
      <RequestLink>
        Request service
        <ArrowUpRight size={17} aria-hidden="true" />
      </RequestLink>
    </div>
  );
}
