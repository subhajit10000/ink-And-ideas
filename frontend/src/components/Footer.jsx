import React from "react";
import {
  Feather,
  Instagram,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Heart,
  Send,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Explore: [
      { label: "Home", href: "#home" },
      { label: "Discover Stories", href: "#discover" },
      { label: "Categories", href: "#categories" },
      { label: "Community", href: "#community" },
    ],
    Resources: [
      { label: "Start Writing", href: "#write" },
      { label: "Writing Tips", href: "#discover" },
      { label: "Popular Quotes", href: "#categories" },
      { label: "Featured Stories", href: "#discover" },
    ],
    Company: [
      { label: "About Us", href: "#about" },
      { label: "Our Community", href: "#community" },
      { label: "Contact", href: "mailto:hello@inkandideas.com" },
      { label: "Privacy Policy", href: "#privacy" },
    ],
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#354331]/10 bg-[#f8f7f4] text-[#354331]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#dce4d5]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#e9e2d4]/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a
              href="#home"
              className="inline-flex items-center gap-3"
              aria-label="Ink and Ideas home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#354331] text-[#f8f7f4] shadow-sm">
                <Feather size={23} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Ink <span className="font-normal italic">&</span> Ideas
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#354331]/70 sm:text-base">
              A little space on the internet for your biggest ideas.
              Share your stories, publish your thoughts, and find inspiration
              in the words of others.
            </p>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">
              {[
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/",
                  icon: Instagram,
                },
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/",
                  icon: Linkedin,
                },
                {
                  label: "Twitter",
                  href: "https://twitter.com/",
                  icon: Twitter,
                },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#354331]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#354331] hover:bg-[#354331] hover:text-white"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em]">
                {heading}
              </h3>

              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-[#354331]/70 transition-colors hover:text-[#354331]"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mb-12 rounded-3xl border border-[#354331]/10 bg-white/60 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#78846d]">
              The Sunday Letter
            </span>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              A little inspiration for your inbox.
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#354331]/65">
              Discover thoughtful reads, fresh perspectives, and stories worth
              sharing.
            </p>
          </div>

          <form
            className="mt-6 flex w-full flex-col gap-3 sm:flex-row lg:mt-0 lg:max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              alert("Thanks for your interest! Newsletter integration is coming soon.");
              event.currentTarget.reset();
            }}
          >
            <label htmlFor="footer-email" className="sr-only">
              Your email address
            </label>

            <input
              id="footer-email"
              type="email"
              placeholder="Enter your email address"
              required
              className="min-w-0 flex-1 rounded-full border border-[#354331]/15 bg-[#f8f7f4] px-5 py-3 text-sm text-[#354331] outline-none transition focus:border-[#354331] focus:ring-2 focus:ring-[#354331]/10"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#354331] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#263124] active:scale-95"
            >
              Subscribe
              <Send size={15} />
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#354331]/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#354331]/65 sm:text-sm">
            © {currentYear} Ink & Ideas. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-[#354331]/65 sm:text-sm">
            Made with <Heart size={14} className="fill-[#b86b58] text-[#b86b58]" />{" "}
            for people who love words.
          </p>

          <a
            href="#home"
            className="text-xs font-medium transition hover:text-[#78846d] sm:text-sm"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;