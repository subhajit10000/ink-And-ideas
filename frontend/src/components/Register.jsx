import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Feather,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  PenLine,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Your name must contain at least 2 characters.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Connect your backend registration API here.
       *
       * Example:
       * await authService.register({
       *   name: formData.name.trim(),
       *   email: formData.email.trim(),
       *   password: formData.password,
       * });
       *
       * On successful registration, navigate to /login
       * or your email-verification page.
       */

      setError("Registration API is not connected yet.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#354331]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left promotional panel */}
        <section className="relative hidden overflow-hidden bg-[#354331] p-10 text-[#f8f7f4] lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#75816c]/20 blur-3xl" />

          {/* Brand */}
          <Link
            to="/"
            className="relative z-10 inline-flex w-fit items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8f7f4] text-[#354331]">
              <Feather size={24} />
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Ink <span className="font-normal italic">&</span> Ideas
            </span>
          </Link>

          {/* Main content */}
          <div className="relative z-10 my-14 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white/80">
              <Sparkles size={14} />
              YOUR STORY DESERVES A SPACE
            </span>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
              Turn your thoughts into{" "}
              <span className="font-serif italic text-[#d7dfcb]">
                something meaningful.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-white/70">
              Join a creative community where every voice matters. Write
              articles, share quotes, tell stories, and find inspiration in
              everyday ideas.
            </p>

            {/* Feature cards */}
            <div className="mt-10 space-y-4">
              {[
                {
                  icon: PenLine,
                  title: "Write freely",
                  description: "Turn your ideas into stories worth sharing.",
                },
                {
                  icon: BookOpen,
                  title: "Discover more",
                  description: "Explore perspectives from other writers.",
                },
                {
                  icon: Sparkles,
                  title: "Find your people",
                  description: "Become part of a thoughtful community.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d7dfcb]">
                    <Icon size={21} />
                  </span>

                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-white/60">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-white/50">
            A home for stories, ideas, and everything in between.
          </p>
        </section>

        {/* Registration panel */}
        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#354331]/70 transition hover:text-[#354331]"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <p className="text-sm text-[#354331]/65">
              Already a member?{" "}
              <Link
                to="/login"
                className="font-bold text-[#354331] underline decoration-[#354331]/30 underline-offset-4 hover:decoration-[#354331]"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
            {/* Mobile brand */}
            <Link
              to="/"
              className="mb-8 flex w-fit items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#354331] text-[#f8f7f4]">
                <Feather size={24} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Ink <span className="font-normal italic">&</span> Ideas
              </span>
            </Link>

            <div className="mb-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7eadf] text-[#354331]">
                <UserRound size={24} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#78846d]">
                Start your journey
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#354331]/65">
                Join Ink & Ideas and give your thoughts a place to grow.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#354331]/40"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    minLength={2}
                    maxLength={80}
                    required
                    className="w-full rounded-xl border border-[#354331]/15 bg-white px-4 py-3.5 pl-11 text-sm outline-none transition placeholder:text-[#354331]/35 focus:border-[#354331] focus:ring-4 focus:ring-[#354331]/5"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#354331]/40"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#354331]/15 bg-white px-4 py-3.5 pl-11 text-sm outline-none transition placeholder:text-[#354331]/35 focus:border-[#354331] focus:ring-4 focus:ring-[#354331]/5"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#354331]/40"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-[#354331]/15 bg-white px-4 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-[#354331]/35 focus:border-[#354331] focus:ring-4 focus:ring-[#354331]/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#354331]/50 transition hover:text-[#354331]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#354331]/50">
                  Use at least 8 characters for your password.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#354331]/40"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#354331]/15 bg-white px-4 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-[#354331]/35 focus:border-[#354331] focus:ring-4 focus:ring-[#354331]/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#354331]/50 transition hover:text-[#354331]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm leading-6 text-[#354331]/70">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#354331]"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-[#354331] underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-[#354331] underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#354331] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#283326] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Small trust note */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#354331]/10 bg-white/60 p-4">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-[#78846d]"
              />

              <p className="text-xs leading-5 text-[#354331]/65">
                Your creative journey starts here. Create an account to
                publish your ideas and discover stories from other writers.
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-[#354331]/65">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#354331] underline decoration-[#354331]/30 underline-offset-4 hover:decoration-[#354331]"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="pb-4 text-center text-xs text-[#354331]/45">
            © {new Date().getFullYear()} Ink & Ideas. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Register;