import { AtSign, MapPin, MessageCircleHeart, Phone, Send } from "lucide-react";
import zuLogo from "../assets/images/zu-logo-social.jpg";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <img
              className="size-12 rounded-full border-2 border-yellow-400 object-cover"
              src={zuLogo}
              alt="Zu Burger Spot logo"
            />
            <span className="text-xl font-black">Zu Burger Spot</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-300">
            Family-friendly burgers, fries, and good moments from Shashemene.
          </p>
          <div className="mt-5 flex gap-3">
            {[MessageCircleHeart, AtSign, Send].map((Icon, index) => (
              <a
                key={index}
                href="/"
                className="grid size-10 place-items-center rounded-full bg-white/10 text-yellow-300 transition hover:bg-yellow-400 hover:text-zinc-950"
                aria-label="Social profile"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
            Contact
          </h3>
          <p className="mb-3 flex gap-2 text-sm text-zinc-300">
            <Phone size={18} /> +251 911 000 000
          </p>
          <p className="flex gap-2 text-sm text-zinc-300">
            <MapPin size={18} /> Shashemene, Ethiopia
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
            Hours
          </h3>
          <p className="text-sm text-zinc-300">Mon - S un: 1:00AM - 3:00PM</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-400">
        (c) 2026 Zu Burger Spot. Demo ordering experience.
      </div>
    </footer>
  );
}
