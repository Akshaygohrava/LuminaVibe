import { useState } from "react";
import { useForm } from "react-hook-form";
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
  Upload,
  Loader2,
} from "lucide-react";
import signUpSide from "../assets/images/signup-sideimage.png";
import laptopBg from "../assets/images/laptopdesign-signinup-bgimage.jpg";
import mobileBg from "../assets/images/mobiledesign-signin-bgimage.jpg";

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

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.99.08 2.16-.52 2.82-1.33z" />
  </svg>
);

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const profilePictureUrl = watch("profile_picture_url");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/users/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const resData = await response.json();
      setValue("profile_picture_url", resData.url, { shouldValidate: true });
    } catch (err) {
      setAvatarUploadError(err.message || "Failed to upload image.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError(null);
    setDone(null);
    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create account. Please try again.");
      }

      setDone("Profile ready — redirecting to sign in page...");
      setTimeout(() => {
        window.navigateTo("/signin");
      }, 1500);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background font-sans">
      <title>Create your LuminaVibe account</title>
      <meta name="description" content="Create a LuminaVibe profile: pick a username, add your bio and photo, and start sharing in seconds." />
      {/* Mobile background image */}
      <img
        src={mobileBg}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1536}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60 md:hidden"
      />
      {/* Laptop/Tablet background image */}
      <img
        src={laptopBg}
        alt=""
        aria-hidden="true"
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover opacity-70 md:block"
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
              src={signUpSide}
              alt="LuminaVibe sign-up layout visualizer"
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

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
              <Field
                label="Full name"
                error={errors.full_name?.message}
                icon={<User className="h-4 w-4" />}
              >
                <input
                  placeholder="Aria Mehta"
                  className={inputBase}
                  {...register("full_name", {
                    required: "Full name is required",
                  })}
                />
              </Field>

              <Field label="Username" error={errors.username?.message} icon={<AtSign className="h-4 w-4" />}>
                <input
                  placeholder="aria.vibes"
                  className={inputBase}
                  autoComplete="username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9._]+$/,
                      message: "Letters, numbers, dots, and underscores only",
                    },
                  })}
                />
              </Field>

              <Field label="Email" error={errors.email?.message} icon={<Mail className="h-4 w-4" />}>
                <input
                  type="email"
                  placeholder="you@luminavibe.app"
                  className={inputBase}
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </Field>

              <Field label="Password" error={errors.password?.message} icon={<Lock className="h-4 w-4" />}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  className={`${inputBase} pr-12`}
                  autoComplete="new-password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must contain 8+ characters, with an uppercase, lowercase, number, and special character",
                    },
                  })}
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
                error={errors.bio?.message}
                icon={<PenLine className="h-4 w-4" />}
              >
                <textarea
                  rows={3}
                  placeholder="Sunset chaser. Film photos & late-night playlists."
                  className={`${inputBase} resize-none`}
                  {...register("bio", {
                    required: "Bio is required",
                  })}
                />
              </Field>

              <Field
                label="Profile picture"
                error={errors.profile_picture_url?.message || avatarUploadError}
                icon={null}
              >
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-white/[0.04] p-4 backdrop-blur-md">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-white/[0.08] overflow-hidden">
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
                    )}
                    {avatarUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={avatarUploading}
                        onClick={() => document.getElementById("avatar-upload-input").click()}
                        className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-white/[0.12] active:scale-[0.98] disabled:opacity-50"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {profilePictureUrl ? "Change photo" : "Upload photo"}
                      </button>
                      {profilePictureUrl && (
                        <button
                          type="button"
                          onClick={() => setValue("profile_picture_url", "", { shouldValidate: true })}
                          className="rounded-xl bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive transition-all hover:bg-destructive/20 active:scale-[0.98]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/80">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>

                  <input
                    id="avatar-upload-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />

                  <input
                    type="hidden"
                    {...register("profile_picture_url", {
                      required: "Profile picture is required",
                    })}
                  />
                </div>
              </Field>

              <button
                type="submit"
                disabled={isLoading || avatarUploading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-display text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
                style={{ backgroundImage: "var(--gradient-sunset)", boxShadow: "var(--shadow-glow)" }}
              >
                {isLoading ? "Creating account..." : avatarUploading ? "Uploading profile picture..." : "Create account"}
                {!isLoading && !avatarUploading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>

              {done ? (
                <p className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground">
                  {done}
                </p>
              ) : null}

              {submitError ? (
                <p className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </p>
              ) : null}
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
              >
                <GoogleIcon className="size-4" />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]"
              >
                <AppleIcon className="size-4 fill-foreground" />
                Apple
              </button>
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
