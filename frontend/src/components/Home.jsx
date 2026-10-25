
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Feather,
  Heart,
  Menu,
  PenLine,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const initialStories = [
  {
    id: 1,
    category: "Life & Living",
    title: "The quiet art of beginning again",
    excerpt:
      "Some beginnings arrive with fireworks. Others look like a slow morning, an open window, and the decision to try once more.",
    author: "Mira Sen",
    date: "Oct 12, 2026",
    read: "6 min read",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 2,
    category: "Creative Notes",
    title: "Make room for the unfinished",
    excerpt:
      "Your first draft is allowed to be messy, your ideas allowed to be strange, and your creative process entirely your own.",
    author: "Arjun Das",
    date: "Oct 10, 2026",
    read: "4 min read",
    image:
      "https://images.unsplash.com/photo-1455390582262-044c071dcca3?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    category: "Short Stories",
    title: "A letter left in the rain",
    excerpt:
      "When the old bookstore closed, a letter slipped from between the pages of a book no one had borrowed in twenty years.",
    author: "Naina Roy",
    date: "Oct 08, 2026",
    read: "8 min read",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 4,
    category: "Poetry & Quotes",
    title: "Things the moon never says",
    excerpt:
      "A little poem about distance, the things we leave unsaid, and finding a kind of home in the night sky.",
    author: "Ishita Paul",
    date: "Oct 06, 2026",
    read: "3 min read",
    image:
      "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1000&q=85",
  },
];

const categories = [
  "All Stories",
  "Life & Living",
  "Short Stories",
  "Poetry & Quotes",
  "Creative Notes",
];

export default function Home() {
  const [stories, setStories] = useState(initialStories);
  const [activeCategory, setActiveCategory] = useState("All Stories");
  const [search, setSearch] = useState("");
  const [savedStories, setSavedStories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [writerOpen, setWriterOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    category: "Life & Living",
    body: "",
  });

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesCategory =
        activeCategory === "All Stories" ||
        story.category === activeCategory;

      const query = search.toLowerCase();

      const matchesSearch =
        story.title.toLowerCase().includes(query) ||
        story.excerpt.toLowerCase().includes(query) ||
        story.author.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [stories, activeCategory, search]);

  const toggleBookmark = (id) => {
    setSavedStories((previous) =>
      previous.includes(id)
        ? previous.filter((storyId) => storyId !== id)
        : [...previous, id]
    );
  };

  const publishDraft = (event) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.body.trim()) return;

    const newStory = {
      id: Date.now(),
      title: draft.title.trim(),
      category: draft.category,
      excerpt:
        draft.body.length > 150
          ? `${draft.body.slice(0, 150)}...`
          : draft.body,
      author: "You",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      read: `${Math.max(
        1,
        Math.ceil(draft.body.split(/\s+/).length / 200)
      )} min read`,
      image:
        "https://images.unsplash.com/photo-1455390582262-044c071dcca3?auto=format&fit=crop&w=1000&q=85",
    };

    setStories((previous) => [newStory, ...previous]);
    setActiveCategory("All Stories");
    setSearch("");
    setDraft({ title: "", category: "Life & Living", body: "" });
    setWriterOpen(false);

    setTimeout(() => {
      document.getElementById("discover")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f7f4] text-[#252821]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-[#e8e6df] bg-[#f8f7f4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#354331] text-white">
              <Feather size={20} />
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight">
              ink<span className="text-[#81946d]">&</span>ideas
              <span className="text-[#81946d]">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm font-semibold text-[#354331]"
            >
              Home
            </a>
            <a
              href="#discover"
              className="text-sm text-[#77796f] transition hover:text-[#354331]"
            >
              Discover
            </a>
            <a
              href="#categories"
              className="text-sm text-[#77796f] transition hover:text-[#354331]"
            >
              Categories
            </a>
            <a
              href="#community"
              className="text-sm text-[#77796f] transition hover:text-[#354331]"
            >
              Community
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setWriterOpen(true)}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#354331] transition hover:bg-[#eeeee7]"
            >
              <PenLine size={16} />
              Write a story
            </button>

            <button
              onClick={() => setWriterOpen(true)}
              className="rounded-full bg-[#354331] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263325]"
            >
              Get started <ArrowUpRight className="ml-1 inline" size={15} />
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#e5e3dc] md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#e8e6df] px-5 py-4 md:hidden">
            {[
              ["Home", "#home"],
              ["Discover", "#discover"],
              ["Categories", "#categories"],
              ["Community", "#community"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 text-sm hover:bg-[#eeeee7]"
              >
                {label}
              </a>
            ))}

            <button
              onClick={() => {
                setWriterOpen(true);
                closeMenu();
              }}
              className="mt-3 w-full rounded-full bg-[#354331] px-4 py-3 text-sm font-semibold text-white"
            >
              Start writing
            </button>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative bg-[radial-gradient(ellipse_at_80%_15%,#e0e8d4,transparent_45%),radial-gradient(ellipse_at_15%_90%,#f0e5d7,transparent_40%)]"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce0d3] bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[2px] text-[#586b4d]">
              <span className="h-2 w-2 rounded-full bg-[#8aa174]" />
              A little corner of the internet
            </div>

            <h1 className="font-serif text-6xl leading-[1.04] tracking-[-2.5px] text-[#293329] sm:text-7xl lg:text-[86px]">
              Your words.
              <br />
              Your{" "}
              <span className="italic text-[#7b8b68]">world.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#77796f] sm:text-lg">
              A home for your stories, thoughts, little observations, and big
              ideas. Write freely. Read deeply. Find your people.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setWriterOpen(true)}
                className="group flex items-center justify-center gap-3 rounded-full bg-[#354331] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[#354331]/10 transition hover:-translate-y-0.5 hover:bg-[#263325]"
              >
                Start writing for free
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#discover"
                className="flex items-center justify-center gap-2 rounded-full border border-[#dcded4] bg-white/60 px-6 py-4 text-sm font-semibold text-[#46513f] transition hover:bg-white"
              >
                Explore stories <ChevronRight size={16} />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3 text-xs text-[#77796f]">
              <div className="flex -space-x-2">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                  "photo-1506794778202-cad84cf45f1d",
                ].map((image) => (
                  <img
                    key={image}
                    src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=64&h=64&q=80`}
                    alt=""
                    className="h-8 w-8 rounded-full border-2 border-[#f8f7f4] object-cover"
                  />
                ))}
              </div>
              <span>
                <strong className="text-[#354331]">12,000+</strong> curious
                minds writing
              </span>
            </div>
          </div>

          {/* HERO IMAGES */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full border border-[#cbd4bd] sm:-right-7 sm:-top-7 sm:h-32 sm:w-32" />

            <div className="relative grid grid-cols-[1fr_.82fr] items-center gap-4">
              <div className="group relative overflow-hidden rounded-t-[45%] rounded-b-2xl shadow-2xl shadow-[#354331]/10">
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044c071dcca3?auto=format&fit=crop&w=800&q=90"
                  alt="Notebook and pen on a writing desk"
                  className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[420px]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 text-white sm:p-7 sm:pt-20">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/70">
                    A note to self
                  </p>
                  <p className="mt-2 font-serif text-xl leading-snug sm:text-2xl">
                    Make a life that feels like you.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group overflow-hidden rounded-t-full rounded-b-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=85"
                    alt="A peaceful mountain landscape"
                    className="h-[180px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[245px]"
                  />
                </div>

                <div className="rounded-2xl bg-[#e4e9db] p-4 sm:p-5">
                  <Sparkles size={20} className="text-[#788a66]" />
                  <p className="mt-3 font-serif text-lg leading-snug sm:text-xl">
                    Small thoughts can hold big worlds.
                  </p>
                  <p className="mt-2 text-[10px] font-semibold tracking-widest text-[#7a806f]">
                    YOUR SPACE TO EXPRESS
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-1 top-8 flex items-center gap-2 rounded-full border border-[#ece9e1] bg-white px-3 py-2 shadow-lg sm:-left-8 sm:top-12 sm:px-4 sm:py-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e9eedf] text-[#536c49]">
                <Feather size={16} />
              </span>
              <span className="text-[11px] font-semibold sm:text-xs">
                Your voice belongs here
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="border-y border-[#e8e6df] bg-[#fdfcf9]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <h2 className="font-serif text-lg">
              Find the words you need.
            </h2>
            <p className="mt-1 text-xs text-[#898a80]">
              Stories and ideas for curious minds.
            </p>
          </div>

          <label className="flex w-full items-center gap-3 rounded-full border border-[#e7e5dd] bg-[#f8f7f4] px-4 py-3 md:max-w-md">
            <Search size={17} className="shrink-0 text-[#85877c]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search stories, topics, writers..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#a1a196]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>
        </div>
      </section>

      {/* DISCOVER STORIES */}
      <section
        id="discover"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mb-9">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#839171]">
            The reading room
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-[-1.5px] sm:text-5xl">
            Stories worth{" "}
            <span className="italic text-[#7b8b68]">staying for.</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#818278]">
            Fresh perspectives, honest words, and writing that makes you
            pause for a moment.
          </p>
        </div>

        {/* CATEGORY FILTERS */}
        <div
          id="categories"
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
                activeCategory === category
                  ? "bg-[#354331] text-white"
                  : "border border-[#e5e3dc] bg-[#fdfcf9] text-[#77796f] hover:bg-[#e9eddf] hover:text-[#354331]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs text-[#929388]">
            {filteredStories.length}{" "}
            {filteredStories.length === 1 ? "story" : "stories"} to explore
          </p>

          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All Stories");
            }}
            className="text-xs font-semibold text-[#6d7e5e] hover:underline"
          >
            Reset filters
          </button>
        </div>

        {/* STORY CARDS */}
        {filteredStories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                className="group overflow-hidden rounded-3xl border border-[#e9e7df] bg-[#fdfcf9] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#354331]/5"
              >
                <div className="relative h-56 overflow-hidden bg-[#e8e9dd]">
                  <img
                    src={story.image}
                    alt={story.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-[#fdfcf9]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#526249] backdrop-blur">
                    {story.category}
                  </span>

                  <button
                    onClick={() => toggleBookmark(story.id)}
                    aria-label={
                      savedStories.includes(story.id)
                        ? "Remove bookmark"
                        : "Bookmark story"
                    }
                    className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition ${
                      savedStories.includes(story.id)
                        ? "bg-[#354331] text-white"
                        : "bg-white/90 text-[#495344] hover:bg-white"
                    }`}
                  >
                    <Bookmark
                      size={17}
                      fill={
                        savedStories.includes(story.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <div className="flex flex-col p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#929388]">
                    <span>{story.date}</span>
                    <span>·</span>
                    <span>{story.read}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl leading-tight tracking-tight transition group-hover:text-[#6d7e5e] sm:text-3xl">
                    {story.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-[#818278]">
                    {story.excerpt}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#eeece5] pt-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e7eadd] text-xs font-bold text-[#56664c]">
                        {story.author
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </span>
                      <span className="text-xs font-semibold text-[#52564b]">
                        {story.author}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-semibold text-[#6d7e5e]">
                      Read story <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d9ddcf] bg-white/60 px-6 py-16 text-center">
            <Search className="mx-auto text-[#9aa58b]" size={30} />
            <h3 className="mt-4 font-serif text-2xl">
              No stories found just yet.
            </h3>
            <p className="mt-2 text-sm text-[#818278]">
              Try another search or choose a different topic.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All Stories");
              }}
              className="mt-5 rounded-full bg-[#354331] px-5 py-3 text-sm font-semibold text-white"
            >
              Show all stories
            </button>
          </div>
        )}
      </section>

      {/* FEATURED QUOTE */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#e9eddf] px-6 py-12 sm:px-12 sm:py-16 lg:px-20">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-[#d0d8c3] sm:right-8 sm:h-96 sm:w-96" />

          <div className="relative max-w-3xl">
            <span className="font-serif text-6xl leading-none text-[#8b9a78]">
              “
            </span>

            <blockquote className="-mt-1 font-serif text-3xl leading-tight tracking-tight text-[#354331] sm:text-4xl lg:text-5xl">
              There is no greater agony than bearing an untold story inside
              you.
            </blockquote>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#9eaa8d]" />
              <p className="text-xs font-bold uppercase tracking-[1.7px] text-[#68765d]">
                Maya Angelou
              </p>
            </div>

            <p className="mt-8 max-w-md text-sm leading-6 text-[#78816e]">
              Your experiences matter. Your voice matters. The world is a
              little richer every time someone dares to share theirs.
            </p>
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section
        id="community"
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24 lg:px-10"
      >
        <div className="grid items-center gap-10 rounded-[30px] border border-[#e9e7df] bg-[#fdfcf9] p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#839171]">
              A community of storytellers
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              The world needs
              <br />
              your <span className="italic text-[#7b8b68]">perspective.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#818278]">
              Whether it is a long article, a tiny story, a meaningful quote,
              or a sentence you cannot stop thinking about, there is room for
              it here.
            </p>

            <button
              onClick={() => setWriterOpen(true)}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#354331] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#263325]"
            >
              Share your first story <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=85"
              alt="Peaceful landscape"
              loading="lazy"
              className="mt-8 h-64 w-full rounded-t-full rounded-b-2xl object-cover sm:h-80"
            />

            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=85"
                alt="Books waiting to be read"
                loading="lazy"
                className="h-44 w-full rounded-t-2xl rounded-b-[100px] object-cover sm:h-56"
              />

              <div className="rounded-2xl bg-[#f0e3d5] p-5">
                <p className="font-serif text-3xl text-[#725e4a]">01.</p>
                <p className="mt-2 text-xs leading-5 text-[#8b7967]">
                  Write what feels true. The rest will follow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#354331] px-5 py-14 text-white sm:px-8 sm:py-16 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#c3d1b1]">
              A little inspiration, occasionally
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Good words for your inbox.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              A thoughtful roundup of stories, prompts, and ideas. No noise,
              just notes.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (newsletterEmail.trim()) setSubscribed(true);
            }}
            className="w-full max-w-md"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.07] p-2 sm:flex-row">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value);
                  setSubscribed(false);
                }}
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/45"
              />

              <button className="flex items-center justify-center gap-2 rounded-full bg-[#e5ebd9] px-5 py-3 text-sm font-bold text-[#354331] transition hover:bg-white">
                {subscribed ? (
                  <>
                    <Check size={16} /> Subscribed
                  </>
                ) : (
                  <>
                    Count me in <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 px-2 text-[10px] leading-5 text-white/45">
              {subscribed
                ? "Thank you for joining our community!"
                : "A little inspiration, delivered with care."}
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f8f7f4]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <a href="#home" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#354331] text-white">
              <Feather size={16} />
            </span>
            <span className="font-serif text-xl font-bold">
              ink<span className="text-[#7a8c66]">&</span>ideas.
            </span>
          </a>

          <p className="text-xs text-[#929388]">
            A small place for big thoughts. Made for the love of words.
          </p>

          <div className="flex gap-5 text-xs text-[#77796f]">
            <a href="#discover" className="hover:text-[#354331]">
              Explore
            </a>
            <a href="#community" className="hover:text-[#354331]">
              Community
            </a>
            <button
              onClick={() => setWriterOpen(true)}
              className="hover:text-[#354331]"
            >
              Write with us
            </button>
          </div>
        </div>

        <div className="border-t border-[#e8e6df] py-4 text-center text-[10px] tracking-wide text-[#a0a196]">
          © 2026 Ink & Ideas. Made with care, and a little bit of ink.
        </div>
      </footer>

      {/* WRITE ARTICLE MODAL */}
      {writerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#1f261f]/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setWriterOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="writer-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-white/50 bg-[#fdfcf9] p-6 shadow-2xl sm:rounded-[28px] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.5px] text-[#7b8b68]">
                  <PenLine size={14} /> Your writing space
                </div>
                <h2
                  id="writer-title"
                  className="mt-2 font-serif text-3xl tracking-tight"
                >
                  Start with a thought.
                </h2>
                <p className="mt-2 text-sm text-[#818278]">
                  An article, a tiny story, a quote, or whatever is on your
                  mind.
                </p>
              </div>

              <button
                onClick={() => setWriterOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#e6e4dc] hover:bg-[#f0efe9]"
                aria-label="Close writing form"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={publishDraft} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#52564b]">
                  Title
                </label>
                <input
                  required
                  maxLength={150}
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  placeholder="A thought worth sharing..."
                  className="w-full rounded-2xl border border-[#e4e2da] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#9aa98b] focus:ring-4 focus:ring-[#e9eddf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#52564b]">
                  Category
                </label>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value })
                  }
                  className="w-full rounded-2xl border border-[#e4e2da] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#9aa98b]"
                >
                  {categories
                    .filter((category) => category !== "All Stories")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-[#52564b]">
                  Your words
                </label>
                <textarea
                  required
                  rows={7}
                  value={draft.body}
                  onChange={(event) =>
                    setDraft({ ...draft, body: event.target.value })
                  }
                  placeholder="Every great story starts somewhere..."
                  className="w-full resize-y rounded-2xl border border-[#e4e2da] bg-white px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-[#9aa98b] focus:ring-4 focus:ring-[#e9eddf]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#eeece5] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-[#999a90]">
                  Your words, your space.
                </p>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#354331] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#263325]"
                >
                  Publish locally <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
