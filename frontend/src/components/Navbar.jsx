
import { useState } from "react";
import {
  BookOpen,
  Search,
  Menu,
  X,
  ArrowUpRight,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Feather,
  ChevronRight,
} from "lucide-react";

export default function Navbar({
  onSearch,
  isLoggedIn = false,
  user,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "Home", href: "/", icon: BookOpen },
    { name: "Explore", href: "/explore", icon: Feather },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    if (onSearch) {
      onSearch(query);
    } else {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }

    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between gap-4">
          {/* LOGO */}
          <a
            href="/"
            onClick={closeMenu}
            aria-label="RapidBlog homepage"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200/60 transition duration-300 group-hover:-rotate-6 group-hover:bg-indigo-700">
              <Feather size={23} strokeWidth={2} />
            </span>

            <span className="text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Rapid<span className="text-indigo-600">Blog</span>
              <span className="text-indigo-600">.</span>
            </span>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Icon
                  size={17}
                  className="transition group-hover:scale-110"
                />
                {name}
              </a>
            ))}
          </nav>

          {/* DESKTOP SEARCH */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden min-w-0 max-w-sm flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 md:flex lg:max-w-md"
          >
            <Search
              size={19}
              className="ml-3 shrink-0 text-slate-400"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories, topics..."
              aria-label="Search blog posts"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
            >
              Search
            </button>
          </form>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            {isLoggedIn ? (
              <a
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                <LayoutDashboard size={17} />
                Dashboard
                <ArrowUpRight
                  size={15}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-700"
                >
                  <LogIn size={17} />
                  Login
                </a>

                <a
                  href="/register"
                  className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  <UserPlus size={17} />
                  Sign up
                  <ChevronRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </a>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* TABLET SEARCH */}
        <form
          onSubmit={handleSearch}
          role="search"
          className="mb-4 flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 md:flex lg:hidden"
        >
          <Search size={18} className="ml-2 shrink-0 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories and topics..."
            aria-label="Search blog posts"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="rounded-lg bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700"
          >
            <Search size={17} />
          </button>
        </form>

        {/* MOBILE NAVIGATION */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 sm:hidden ${
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="space-y-2 border-t border-slate-100 py-4">
              {navLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Icon size={19} className="text-indigo-600" />
                  {name}
                  <ArrowUpRight size={15} className="ml-auto text-slate-400" />
                </a>
              ))}

              {/* MOBILE SEARCH */}
              <form
                onSubmit={handleSearch}
                role="search"
                className="flex gap-2 px-1 py-2"
              >
                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-indigo-400">
                  <Search size={18} className="shrink-0 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    aria-label="Search blog posts"
                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  aria-label="Search"
                  className="grid w-12 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700"
                >
                  <Search size={19} />
                </button>
              </form>

              {/* MOBILE AUTH */}
              {isLoggedIn ? (
                <a
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                  <ArrowUpRight size={16} />
                </a>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <LogIn size={17} />
                    Login
                  </a>

                  <a
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <UserPlus size={17} />
                    Sign up
                  </a>
                </div>
              )}

              <p className="pt-3 text-center text-xs text-slate-400">
                Your ideas deserve to be read. Write with RapidBlog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
