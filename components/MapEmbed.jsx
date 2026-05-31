import { ExternalLink, MapPin } from "lucide-react";
import { getMapEmbedUrl, getMapOpenUrl } from "@/lib/map-utils";

export default function MapEmbed({ mapUrl, location, title }) {
  const embedUrl = getMapEmbedUrl(mapUrl);
  const openUrl = getMapOpenUrl(mapUrl, location);

  if (!embedUrl && !openUrl) {
    return null;
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
            Lokalita
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink">Mapa nemovitosti</h2>
        </div>
        {openUrl ? (
          <a
            href={openUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Otevřít v Mapy.com
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      {embedUrl ? (
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-zinc-100">
          <iframe
            title={`Mapa lokality - ${title}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-5">
          <p className="text-sm leading-6 text-zinc-600">
            Interaktivní vložená mapa vyžaduje iframe odkaz z Mapy.com. Pro
            přesnou polohu použijte tlačítko otevření mapy.
          </p>
        </div>
      )}
      <p className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
        <MapPin className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
        {location}
      </p>
    </section>
  );
}
