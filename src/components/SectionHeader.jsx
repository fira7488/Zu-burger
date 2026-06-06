export default function SectionHeader({ eyebrow, title, body, align = "left" }) {
  return (
    <div className={`mx-auto mb-8 max-w-3xl ${align === "center" ? "text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-yellow-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-base leading-7 text-zinc-600 md:text-lg">{body}</p>}
    </div>
  );
}
