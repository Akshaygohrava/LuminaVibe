import { useState } from "react";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Sparkles,
  Check,
  ArrowRight,
  AtSign,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
  PenLine,
} from "lucide-react";
import authSide from "../assets/images/socialmedia-register.webp";
import authBg from "../assets/images/signinup page.webp";

const signUpSchema = z.object({
  full_name: z.string().trim().max(100).optional().or(z.literal("")),
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50)
    .regex(/^[a-zA-Z0-9._]+$/, { message: "Letters, numbers, dots and underscores only" }),
  email: z.string().trim().email({ message: "Enter a valid email" }).max(100),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(255),
  bio: z
    .string()
    .trim()
    .max(300, { message: "Keep your bio under 300 characters" })
    .optional()
    .or(z.literal("")),
  profile_picture_url: z
    .string()
    .trim()
    .url({ message: "Enter a valid image URL" })
    .max(255)
    .optional()
    .or(z.literal("")),
});

const inputBase =
  "peer w-full rounded-2xl border border-border bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-foreground backdrop-blur-md outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-primary/40 hover:bg-white/[0.07] focus:border-primary/70 focus:bg-white/[0.09] focus:shadow-[0_0_0_4px_oklch(0.7_0.19_40/0.14),0_10px_30px_-14px_oklch(0.7_0.19_40/0.6)]";

function Link({ to, children, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.navigateTo(to);
  };
  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

function Field({
  label,
  hint,
  error,
  icon,
  children,
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
        {hint ? (
          <span className="normal-case tracking-normal text-muted-foreground/60">{hint}</span>
        ) : null}
      </span>
      <span className="group relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-4 text-muted-foreground/70 transition-colors duration-300 group-focus-within:text-primary">
            {icon}
          </span>
        ) : null}
        {children}
      </span>
      {error ? <span className="block text-xs font-medium text-destructive">{error}</span> : null}
    </label>
  );
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const result = signUpSchema.safeParse(raw);

    if (!result.success) {
      const next = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setDone(null);
      return;
    }

    setErrors({});
    setDone("Profile ready — connect a backend to save this account.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-sans">
      <title>Create your LuminaVibe account</title>
      <meta name="description" content="Create a LuminaVibe profile: pick a username, add your bio and photo, and start sharing in seconds." />
      <img
        src={authBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, oklch(0.7 0.19 40 / 0.18), transparent 55%), radial-gradient(circle at 85% 80%, oklch(0.62 0.22 5 / 0.22), transparent 55%), linear-gradient(180deg, oklch(0.16 0.03 265 / 0.72), oklch(0.14 0.03 265 / 0.92))",
        }}
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-6 overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src={authSide}
              alt="Collage of LuminaVibe creators sharing photos at golden hour"
              width={1024}
              height={1536}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-ink)" }} />
            <div className="relative flex h-full flex-col justify-between p-10">
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
                  style={{
                    backgroundImage: "var(--gradient-sunset)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="font-display text-lg font-semibold tracking-tight text-foreground">
                  LuminaVibe
                </span>
              </div>

              <div className="max-w-md">
                <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground">
                  Where your everyday
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-sunset)" }}
                  >
                    {" "}
                    glows brighter
                  </span>
                  .
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  Share the moments in between. Build a feed that actually feels like you.
                </p>
                <ul className="mt-8 space-y-3">
                  {[
                    "A profile you fully own",
                    "Vibes-first, algorithm-second feed",
                    "Creator circles & close friends",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/85">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-primary">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                Create · Connect · Inspire
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-10">
          <div
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-card/60 p-7 backdrop-blur-2xl sm:p-9"
            style={{ boxShadow: "var(--shadow-panel)" }}
          >
            <div className="mb-7 flex items-center gap-2.5 lg:hidden">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-sunset)" }}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">LuminaVibe</span>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              Create your vibe
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A few details and your profile is live.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              <Field
                label="Full name"
                hint="optional"
                error={errors["full_name"]}
                icon={<User className="h-4 w-4" />}
              >
                <input name="full_name" maxLength={100} placeholder="Aria Mehta" className={inputBase} />
              </Field>

              <Field label="Username" error={errors["username"]} icon={<AtSign className="h-4 w-4" />}>
                <input
                  name="username"
                  maxLength={50}
                  placeholder="aria.vibes"
                  className={inputBase}
                  autoComplete="username"
                />
              </Field>

              <Field label="Email" error={errors["email"]} icon={<Mail className="h-4 w-4" />}>
                <input
                  name="email"
                  type="email"
                  maxLength={100}
                  placeholder="you@luminavibe.app"
                  className={inputBase}
                  autoComplete="email"
                />
              </Field>

              <Field label="Password" error={errors["password"]} icon={<Lock className="h-4 w-4" />}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  maxLength={255}
                  placeholder="At least 8 characters"
                  className={`${inputBase} pr-12`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </Field>

              <Field
                label="Bio"
                hint="optional"
                error={errors["bio"]}
                icon={<PenLine className="h-4 w-4" />}
              >
                <textarea
                  name="bio"
                  rows={3}
                  maxLength={300}
                  placeholder="Sunset chaser. Film photos & late-night playlists."
                  className={`${inputBase} resize-none`}
                />
              </Field>

              <Field
                label="Profile picture URL"
                hint="optional"
                error={errors["profile_picture_url"]}
                icon={<ImageIcon className="h-4 w-4" />}
              >
                <input
                  name="profile_picture_url"
                  maxLength={255}
                  placeholder="https://…/avatar.jpg"
                  className={inputBase}
                />
              </Field>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                style={{ backgroundImage: "var(--gradient-sunset)", boxShadow: "var(--shadow-glow)" }}
              >
                Create account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              {done ? (
                <p className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground">
                  {done}
                </p>
              ) : null}
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {["Google", "Apple"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="mt-7 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="font-semibold text-primary hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
