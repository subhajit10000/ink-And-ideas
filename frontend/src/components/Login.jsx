import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Feather,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Quote,
  CheckCircle2,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Connect your authentication API here.
       *
       * Example:
       * const response = await authService.login(formData);
       * Store the returned authentication data securely.
       * navigate("/");
       *
       * This page currently provides the login UI only.
       */

      setError("Authentication API is not connected yet.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#354331]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left panel */}
        <section className="relative hidden overflow-hidden bg-[#354331] p-10 text-[#f8f7f4] lg:flex lg:flex-col lg:justify-between xl:p-16">
          {/* Background decorations */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#75816c]/20 blur-3xl" />

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

          {/* Main message */}
          <div className="relative z-10 my-14 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium tracking-wide text-white/80">
              <Sparkles size={14} />
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
              Every great story begins with a{" "}
              <span className="font-serif italic text-[#d7dfcb]">
                single thought.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-white/70">
              Come back to the words that matter. Discover fresh perspectives,
              share your stories, and connect with people who see the world
              differently.
            </p>

            {/* Quote card */}
            <div className="mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <Quote size={25} className="text-[#d7dfcb]" />

              <p className="mt-4 font-serif text-xl italic leading-8 text-white/90">
                "There is no greater agony than bearing an untold story inside
                you."
              </p>

              <p className="mt-4 text-sm text-white/50">
                — Maya Angelou
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 flex items-center gap-2 text-sm text-white/50">
            <BookOpen size={16} />
            A home for stories, ideas, and everything in between.
          </div>
        </section>

        {/* Right panel */}
        <section className="relative flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#354331]/70 transition hover:text-[#354331] lg:hidden"
            >
              <ArrowLeft size={17} />
              Back to home
            </Link>

            <Link
              to="/"
              className="hidden items-center gap-2 text-sm text-[#354331]/70 transition hover:text-[#354331] lg:inline-flex"
            >
              <ArrowLeft size={17} />
              Back to website
            </Link>

            <Link
              to="/register"
              className="text-sm font-semibold transition hover:text-[#78846d]"
            >
              Create account
            </Link>
          </div>

          {/* Login form container */}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            {/* Mobile brand */}
            <Link
              to="/"
              className="mb-10 flex w-fit items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#354331] text-[#f8f7f4]">
                <Feather size={24} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Ink <span className="font-normal italic">&</span> Ideas
              </span>
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7eadf] text-[#354331]">
                <Feather size={25} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#78846d]">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#354331]/65">
                Your stories are waiting for you. Pick up right where you left
                off.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#65745b] transition hover:text-[#354331]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#354331]/40"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#354331]/15 bg-white px-4 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-[#354331]/35 focus:border-[#354331] focus:ring-4 focus:ring-[#354331]/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#354331]/50 transition hover:text-[#354331]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-3 text-sm text-[#354331]/75">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 accent-[#354331]"
                />

                Remember me
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#354331] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#283326] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#354331]/10" />
              <span className="text-xs text-[#354331]/45">
                YOUR CREATIVE SPACE AWAITS
              </span>
              <div className="h-px flex-1 bg-[#354331]/10" />
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                "Publish your own stories and articles",
                "Save inspiring quotes and reads",
                "Connect with a community of writers",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 text-sm text-[#354331]/70"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-[#78846d]"
                  />
                  {benefit}
                </div>
              ))}
            </div>

            {/* Register link */}
            <p className="mt-8 text-center text-sm text-[#354331]/65">
              New to Ink & Ideas?{" "}
              <Link
                to="/register"
                className="font-bold text-[#354331] underline decoration-[#354331]/30 underline-offset-4 transition hover:decoration-[#354331]"
              >
                Join our community
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <div className="pb-4 text-center text-xs leading-6 text-[#354331]/45">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;