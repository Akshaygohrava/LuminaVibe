import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Compass,
  Flame,
  Headphones,
  Heart,
  MapPin,
  Menu,
  Minus,
  PlayCircle,
  Plus,
  Quote,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  UserPlus,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";

// Brand icons defined locally because they were removed in lucide-react v1.0
const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Youtube = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

import heroApp from "../assets/images/hero-app.jpg";
import gallery1 from "../assets/images/gallery-1.jpg";
import gallery2 from "../assets/images/gallery-2.jpg";
import gallery3 from "../assets/images/gallery-3.jpg";
import gallery4 from "../assets/images/gallery-4.jpg";
import gallery5 from "../assets/images/gallery-5.jpg";
import gallery6 from "../assets/images/gallery-6.jpg";

/* ------------------------------------------------------------------ data */

const navLinks = [
  { href: "#feed", label: "Feed" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#stories", label: "Stories" },
  { href: "#pulse", label: "Live now" },
  { href: "#faq", label: "FAQ" },
];

const slides = [
  { img: gallery1, tag: "#nightout", author: "@marisol", likes: "12.4k" },
  { img: gallery2, tag: "#golive", author: "@devon.k", likes: "8.9k" },
  { img: gallery3, tag: "#aurora", author: "@zephyr", likes: "31.2k" },
  { img: gallery4, tag: "#streetline", author: "@kaito", likes: "19.7k" },
  { img: gallery5, tag: "#rooftops", author: "@ines.rv", likes: "24.1k" },
  { img: gallery6, tag: "#afterdark", author: "@nova.b", likes: "15.3k" },
];

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Claim your glow",
    body: "Pick a handle, choose three things you're into, and skip the 12-step onboarding. Takes about 40 seconds.",
  },
  {
    icon: Compass,
    step: "02",
    title: "Find your circles",
    body: "Vibe Match introduces you to small rooms and creators near your taste — not the loudest accounts of the week.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Go live, stay close",
    body: "Post glow stories, open a room in one tap, and keep the five people who matter in an invite-only circle.",
  },
];

const features = [
  { icon: Radio, title: "Live Rooms", body: "Drop into audio + video rooms in one tap. No scheduling, no awkward links." },
  { icon: Camera, title: "Glow Stories", body: "Cinematic filters tuned for low light, so your midnight moments stay vivid." },
  { icon: Waves, title: "Vibe Match", body: "A feed shaped by what you actually love, not by what shouts the loudest." },
  { icon: Users, title: "Micro Circles", body: "Tiny private spaces for the five people who get you. Invite-only, always." },
  { icon: ShieldCheck, title: "Real Privacy", body: "End-to-end encrypted DMs and one-switch ghost mode when you need quiet." },
  { icon: Zap, title: "Instant Everything", body: "Under 40ms interactions. Scroll, react, and post without a single spinner." },
];

const stories = [
  {
    name: "Maya Okafor",
    role: "Night photographer, Lagos",
    initials: "MO",
    quote: "The low-light filters actually respect the shot. I stopped exporting to three other apps before posting.",
  },
  {
    name: "Deniz Aral",
    role: "Runs a 40-person run club",
    initials: "DA",
    quote: "We moved the whole club here. Live rooms before a run, circles after. Nobody misses the group chat.",
  },
  {
    name: "Priya Raman",
    role: "Music producer",
    initials: "PR",
    quote: "I dropped a demo in a live room at 2am and had five collaborators by morning. That never happened elsewhere.",
  },
  {
    name: "Jonas Vetter",
    role: "Illustrator, Berlin",
    initials: "JV",
    quote: "Vibe Match surfaces small accounts doing wild work. My feed finally feels handpicked instead of auctioned.",
  },
];

const rooms = [
  { name: "Slow synths & studio talk", host: "@marisol", people: 342, tag: "Live Room", icon: Headphones },
  { name: "Rooftop golden hour swap", host: "@ines.rv", people: 118, tag: "Circle", icon: MapPin },
  { name: "3AM playlist roulette", host: "@nova.b", people: 907, tag: "Live Room", icon: Flame },
  { name: "First-post nerves club", host: "@devon.k", people: 64, tag: "Circle", icon: Sparkles },
];

const faqs = [
  {
    q: "Is LuminaVibe actually free?",
    a: "Yes. Every core feature — live rooms, glow stories, circles, encrypted DMs — is free. We fund the app with an optional Pro tier for creators who want longer broadcasts and deeper analytics.",
  },
  {
    q: "How is the feed ranked?",
    a: "Vibe Match weighs what you linger on, save, and reply to. It never boosts posts for payment, and you can switch to a plain chronological feed at any time from settings.",
  },
  {
    q: "Are my DMs really private?",
    a: "Direct messages are end-to-end encrypted by default. Ghost mode hides your activity status, read receipts, and room presence with a single switch.",
  },
  {
    q: "Which devices are supported?",
    a: "iOS 16+, Android 11+, and a full-featured web app. Rooms and stories sync instantly across every device you're signed into.",
  },
  {
    q: "Can I bring my community over?",
    a: "Import your follower list from any major platform, then invite people into a circle with one shareable link. Moderators keep their roles during the move.",
  },
];

const stats = [
  { value: "2.4M", label: "creators glowing" },
  { value: "180+", label: "countries" },
  { value: "94%", label: "stay past month one" },
];

const marquee = ["#nightout", "#golive", "#aurora", "#streetline", "#microcircles", "#lowlight", "#vibematch"];

const footerColumns = [
  { title: "Product", links: ["Live Rooms", "Glow Stories", "Vibe Match", "Micro Circles", "Pro for creators"] },
  { title: "Company", links: ["About", "Careers", "Press kit", "Blog", "Contact"] },
  { title: "Resources", links: ["Help center", "Community rules", "Creator academy", "Status", "Developers"] },
];

/* ---------------------------------------------------------------- helpers */

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}

function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-32 size-[22rem] rounded-full bg-primary/30 blur-[110px] animate-aurora sm:size-[32rem] sm:blur-[140px] lg:size-[38rem]" />
      <div className="absolute -right-24 top-1/4 size-[18rem] rounded-full bg-aqua/25 blur-[110px] animate-aurora [animation-delay:-6s] sm:size-[28rem] sm:blur-[150px] lg:size-[32rem]" />
      <div className="absolute bottom-0 left-1/3 size-[18rem] rounded-full bg-primary-glow/25 blur-[110px] animate-aurora [animation-delay:-11s] sm:size-[26rem] sm:blur-[160px] lg:size-[30rem]" />
    </div>
  );
}

/* -------------------------------------------------------------------- nav */

function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-4 ${
        scrolled ? "py-2" : "py-3 sm:py-5"
      }`}
    >
      <nav
        className={`nav-shell relative mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full px-3 py-2 transition-all duration-500 sm:px-4 sm:py-2.5 ${
          scrolled ? "nav-shell-solid" : ""
        }`}
      >
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-2 pl-0.5 font-display text-lg font-bold sm:gap-2.5 sm:pl-1 sm:text-xl"
        >
          <span className="relative grid size-8 shrink-0 place-items-center rounded-2xl bg-aurora transition-all duration-500 group-hover:rotate-[18deg] group-hover:rounded-full sm:size-9">
            <Sparkles className="size-4 text-primary-foreground" />
            <span className="absolute inset-0 rounded-2xl bg-aurora opacity-60 blur-md transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <span className="truncate text-aurora">LuminaVibe</span>
        </a>

        <ul className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`group relative inline-block rounded-full px-3 py-2 transition-all duration-300 hover:text-foreground xl:px-4 ${
                  active === link.href ? "text-foreground" : ""
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full bg-aurora transition-all duration-300 ${
                    active === link.href ? "opacity-20" : "opacity-0 group-hover:opacity-15"
                  }`}
                />
                <span className="relative">{link.label}</span>
                <span
                  className={`absolute inset-x-4 bottom-1 h-px rounded-full bg-aurora transition-transform duration-300 ${
                    active === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/signin"
            onClick={(e) => {
              e.preventDefault();
              window.navigateTo("/signin");
            }}
            className="btn-ink hidden rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:inline-block"
          >
            Sign in
          </a>
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault();
              window.navigateTo("/signup");
            }}
            className="btn-shine btn-ember relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 sm:px-5"
          >
            <span className="relative">Sign up</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        <span aria-hidden className="absolute inset-x-8 bottom-0 h-px overflow-hidden rounded-full">
          <span className="block h-full bg-aurora transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </span>
      </nav>

      {open && (
        <div className="nav-shell nav-shell-solid mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden animate-fade-in">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="sm:hidden">
              <a
                href="/signin"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  window.navigateTo("/signin");
                }}
                className="block rounded-2xl border border-border px-4 py-3 text-sm text-foreground"
              >
                Sign in
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

/* --------------------------------------------------------------- carousel */

function VibeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, i) => (
            <div
              key={slide.tag}
              className="min-w-0 shrink-0 grow-0 basis-[82%] px-2 sm:basis-[46%] sm:px-3 lg:basis-[32%]"
            >
              <figure
                className={`group relative overflow-hidden rounded-3xl border border-border transition-all duration-500 ${
                  selected === i ? "scale-100 opacity-100 glow-ring" : "scale-95 opacity-60"
                }`}
              >
                <img
                  src={slide.img}
                  alt={`LuminaVibe post tagged ${slide.tag} by ${slide.author}`}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-[20rem] w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-[24rem] lg:h-[26rem]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-background via-background/70 to-transparent p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base text-aurora sm:text-lg">{slide.tag}</p>
                    <p className="truncate text-sm text-muted-foreground">{slide.author}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full glass px-3 py-1.5 text-sm">
                    <Heart className="size-4 text-primary-glow transition-transform duration-300 group-hover:scale-125" />
                    {slide.likes}
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous post"
          className="grid size-11 shrink-0 place-items-center rounded-full glass transition-all hover:scale-110 hover:text-primary-glow"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex flex-wrap justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.tag}
              type="button"
              aria-label={`Go to ${slide.tag}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                selected === i ? "w-8 bg-aurora" : "w-2 bg-muted hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next post"
          className="grid size-11 shrink-0 place-items-center rounded-full glass transition-all hover:scale-110 hover:text-primary-glow"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- faq */

function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="w-full">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="mb-3 overflow-hidden rounded-2xl glass transition-colors duration-300 hover:border-primary/50"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-base"
            >
              <span className="min-w-0">{item.q}</span>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary/70 text-ember">
                {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
              </span>
            </button>
            <div
              className={`grid transition-all duration-500 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- footer */

function SiteFooter() {
  return (
    <footer id="community" className="relative mt-10 border-t border-border">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-px bg-aurora opacity-60" />
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <div className="min-w-0">
            <a href="#top" className="flex items-center gap-2.5 font-display text-xl font-bold">
              <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-aurora">
                <Sparkles className="size-4 text-primary-foreground" />
              </span>
              <span className="text-aurora">LuminaVibe</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A social app built for the hours after dark. Live rooms, vivid stories, and circles
              small enough to feel like home.
            </p>

            <form
              className="mt-6 flex w-full max-w-sm flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="you@night.owl"
                className="min-w-0 flex-1 rounded-full glass px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ember/70"
              />
              <button
                type="submit"
                className="btn-ember btn-shine relative overflow-hidden rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105"
              >
                <span className="relative">Get my invite</span>
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "X" },
                { icon: Youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full glass transition-all duration-300 hover:-translate-y-1 hover:text-ember"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="font-display text-sm uppercase tracking-[0.18em] text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="inline-block transition-all duration-300 hover:translate-x-1 hover:text-ember"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} LuminaVibe. Made for the after hours.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {["Privacy", "Terms", "Cookies", "Safety"].map((l) => (
              <li key={l}>
                <a href="#top" className="transition-colors hover:text-foreground">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ page */

export default function LandingPage() {
  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden">
      <AuroraBackdrop />
      <SiteNav />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-20 sm:gap-12 sm:pb-24 sm:pt-24 lg:grid-cols-2 lg:pt-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Now in open beta
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl">
              Where your people <span className="text-aurora">glow</span>.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:mt-6 sm:text-lg">
              LuminaVibe is a social app built for the hours after dark — live rooms, vivid stories,
              and circles small enough to feel like home.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#feed"
                className="btn-ember btn-shine group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 font-semibold transition-all duration-300 hover:scale-105 sm:px-7"
              >
                Explore the feed
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#how"
                className="btn-ink inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-all duration-300 hover:scale-105 sm:px-7"
              >
                <PlayCircle className="size-4" />
                See how it works
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 sm:mt-12 sm:flex sm:gap-10">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold text-aurora sm:text-3xl">{stat.value}</dd>
                  <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={150} className="relative">
            <div className="absolute inset-8 rounded-full bg-primary/30 blur-[90px]" />
            <img
              src={heroApp}
              alt="LuminaVibe app feed glowing on a smartphone"
              width={1024}
              height={1024}
              className="relative mx-auto w-full max-w-xs rounded-[2rem] animate-float-soft sm:max-w-md"
            />
          </Reveal>
        </section>

        {/* Marquee */}
        <div className="relative flex overflow-hidden border-y border-border py-3 sm:py-4">
          <div className="flex w-max animate-marquee gap-6 pr-6 sm:gap-10 sm:pr-10">
            {[...marquee, ...marquee].map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="font-display text-lg text-muted-foreground/70 transition-colors hover:text-primary-glow sm:text-2xl"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Feed carousel */}
        <section id="feed" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal className="mb-10 text-center sm:mb-12">
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              Tonight on <span className="text-aurora">LuminaVibe</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Swipe, drag, or use the arrows — this is what the feed looks like right now.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <VibeCarousel />
          </Reveal>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal className="mb-10 max-w-2xl sm:mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-primary-glow sm:text-sm">
              How it works
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
              Three steps from lurker to regular
            </h2>
          </Reveal>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 110}>
                <li className="group relative h-full overflow-hidden rounded-3xl glass p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/60 sm:p-8">
                  <span className="absolute -right-3 -top-6 font-display text-7xl font-bold text-foreground/5 transition-colors duration-500 group-hover:text-primary/20 sm:text-8xl">
                    {s.step}
                  </span>
                  <s.icon className="size-8 text-primary-glow transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 sm:size-9" />
                  <h3 className="relative mt-5 font-display text-lg font-semibold sm:mt-6 sm:text-xl">
                    {s.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal className="mb-10 max-w-2xl sm:mb-14">
            <h2 className="font-display text-3xl font-bold sm:text-5xl">
              Built for the way you actually hang out
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 80}>
                <article className="group h-full rounded-3xl glass tilt-card p-6 sm:p-7">
                  <feature.icon className="size-8 text-primary-glow transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
                  <h3 className="mt-5 font-display text-lg font-semibold sm:text-xl">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Stories */}
        <section id="stories" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal className="mb-10 max-w-2xl sm:mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-primary-glow sm:text-sm">Stories</span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
              People who moved their whole world here
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {stories.map((s, i) => (
              <Reveal key={s.name} delay={i * 90}>
                <figure className="group relative h-full overflow-hidden rounded-3xl glass p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/60 hover:glow-ring sm:p-7">
                  <Quote className="size-7 text-primary/50 transition-transform duration-500 group-hover:scale-110 sm:size-8" />
                  <blockquote className="mt-4 text-base leading-relaxed sm:text-lg">{s.quote}</blockquote>
                  <figcaption className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 sm:flex">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-aurora font-display text-sm font-bold text-primary-foreground">
                      {s.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{s.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{s.role}</span>
                    </span>
                    <span className="col-span-2 flex gap-0.5 sm:col-auto sm:ml-auto">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star key={k} className="size-3.5 fill-primary-glow text-primary-glow" />
                      ))}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Night pulse */}
        <section id="pulse" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <Reveal className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-ember" />
                Happening right now
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold sm:text-5xl">
                The <span className="text-aurora">night pulse</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground sm:text-base">
              Rooms open and close every few minutes. This is a live snapshot of what your timezone is
              doing at this hour.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {rooms.map((room, i) => (
              <Reveal key={room.name} delay={i * 80}>
                <article className="group flex h-full items-center gap-4 rounded-3xl glass p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-ember/60 sm:p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary/70 transition-transform duration-500 group-hover:rotate-6">
                    <room.icon className="size-5 text-ember" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{room.tag}</p>
                    <h3 className="mt-1 truncate font-display text-base font-semibold sm:text-lg">
                      {room.name}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      hosted by {room.host} · {room.people} listening
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
          <Reveal className="mb-10 text-center sm:mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-primary-glow sm:text-sm">FAQ</span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
              Everything people ask us first
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <FaqList />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}