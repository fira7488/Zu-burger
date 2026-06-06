import { Award, Clock3, Flame, Leaf, Star } from "lucide-react";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import chefSign from "../assets/images/zu-chef-sign.jpg";
import socialLogo from "../assets/images/zu-logo-social.jpg";
import storeSign from "../assets/images/zu-store-sign.jpg";
import wallQuote from "../assets/images/zu-wall-quote.jpg";
import { menuItems } from "../data/menuItems";
import { useTranslation } from "../i18n";

const heroImage =
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1600&q=90";

const reasons = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    body: "Daily produce, soft buns, and sauces prepared in-house.",
  },
  {
    icon: Clock3,
    title: "Fast Service",
    body: "Built for quick family dinners, lunch breaks, and weekend cravings.",
  },
  {
    icon: Award,
    title: "Premium Taste",
    body: "Balanced recipes with smoky, spicy, creamy, and crisp layers.",
  },
  {
    icon: Star,
    title: "Affordable Prices",
    body: "Generous portions and combo value without losing the premium feel.",
  },
];

const reviews = [
  {
    name: "Mekdes A.",
    text: "The kids loved the crispy chicken burger, and the order flow was so easy.",
  },
  {
    name: "Dawit T.",
    text: "Big flavor, clean packaging, and the loaded fries are now a family favorite.",
  },
  {
    name: "Hana B.",
    text: "Feels premium but welcoming. Exactly the kind of burger place Shashemene needs.",
  },
];

const socialProof = [
  {
    image: chefSign,
    title: "Playful Chef Sign",
    body: "A friendly, family-ready character style that feels approachable for walk-ins and kids.",
  },
  {
    image: wallQuote,
    title: "Heart-Led Brand Quote",
    body: "The in-store message becomes a memorable campaign line for digital ordering.",
  },
  {
    image: storeSign,
    title: "Gold Storefront Identity",
    body: "The yellow sign language drives the website accent system and CTA treatment.",
  },
];

export default function Home() {
  const featured = menuItems.filter((item) => item.featured).slice(0, 4);
  const { t } = useTranslation();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-zinc-950 text-white">
        <img
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          src={heroImage}
          alt="A premium Zu Burger Spot meal"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black via-zinc-950/85 to-zinc-950/30" />
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-zinc-950">
              #zuburgu #shashemene
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-200">
              {t("home.heroBody")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/menu">{t("home.orderNow")}</Button>
              <Button
                to="/menu"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-red-900"
              >
                {t("home.viewMenu")}
              </Button>
            </div>
          </div>
          <div className="hidden rounded-lg border border-white/15 bg-black/55 p-5 shadow-2xl shadow-black/40 backdrop-blur lg:block">
            <img
              className="mx-auto aspect-square w-56 rounded-full border-4 border-yellow-400 object-cover"
              src={socialLogo}
              alt="Zu Burger Spot social logo"
            />
            <div className="mt-5 rounded-lg bg-white/10 p-4 text-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
                Brand line
              </p>
              <p className="mt-2 text-xl font-black">
                I followed my heart and it led me to Zu Burger.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
                From social media
              </p>
              <h2 className="max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
                Built around the real Zu Burger Spot personality.
              </h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {socialProof.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-lg border border-white/10 bg-white/5"
              >
                <img
                  className="aspect-4/5 w-full object-cover"
                  src={item.image}
                  alt={item.title}
                />
                <div className="p-5">
                  <h3 className="text-xl font-black text-yellow-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={t("section.bestSellersEyebrow") || "Best sellers"}
            title={t("section.featuredTitle") || "Featured Burgers"}
            body={
              t("section.featuredBody") ||
              "Client-ready product cards with strong photography, clear pricing, and direct add-to-cart actions."
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            align="center"
            eyebrow="Why choose us"
            title="Designed for repeat family orders"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-lg border border-zinc-200 p-6 text-center transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-yellow-100 text-zinc-950">
                  <Icon size={25} />
                </div>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg bg-zinc-950 md:grid-cols-2">
          <div className="p-8 text-white md:p-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
              Special offer
            </p>
            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              Family Feast Combo
            </h2>
            <p className="mt-4 text-zinc-200">
              Two signature burgers, loaded fries, onion rings, and two drinks
              for one warm family table.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-3xl font-black text-yellow-300">
                ETB 1,650
              </span>
              <Button to="/menu" variant="secondary">
                Order Deal
              </Button>
            </div>
          </div>
          <img
            className="h-full min-h-72 w-full object-cover"
            src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1100&q=90"
            alt="Family burger combo"
          />
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            align="center"
            eyebrow="Reviews"
            title="Guests already taste the difference"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-lg border border-zinc-200 p-6 shadow-sm"
              >
                <div className="mb-4 flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="leading-7 text-zinc-700">"{review.text}"</p>
                <p className="mt-5 font-black text-zinc-950">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
