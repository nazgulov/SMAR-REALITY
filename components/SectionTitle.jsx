export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-zinc-600">{description}</p>
      ) : null}
    </div>
  );
}
