import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, House, MapPin, PlayCircle, Ruler } from "lucide-react";
import { propertyTypeLabels } from "@/data/properties";
import { getAreaItems, getPrimarySizeLabel } from "@/lib/property-display";

const badgeStyles = {
  prodej: "bg-brand-700 text-white",
  pronajem: "bg-amber-500 text-zinc-950"
};

export default function PropertyCard({ property }) {
  const typeLabel = propertyTypeLabels[property.type] ?? property.type;
  const areaItems = getAreaItems(property);
  const primarySize = getPrimarySizeLabel(property);
  const featurePreview = (property.features ?? []).slice(0, 2);

  return (
    <Link
      href={`/nemovitosti/${property.id}`}
      className="focus-ring group block rounded-lg"
      aria-label={`Zobrazit detail: ${property.title}`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-soft">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${badgeStyles[property.type]}`}
          >
            {typeLabel}
          </span>
          {property.videoUrl ? (
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink shadow-sm">
              <PlayCircle className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
              Video
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-xl font-semibold text-brand-900">
            {property.price}
          </p>
          <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-6 text-ink">
            {property.title}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
            <MapPin className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
            <span className="line-clamp-1">{property.location}</span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-700">
            {property.layout ? (
              <span className="flex min-h-11 items-center gap-2 rounded-lg bg-zinc-100 px-3 font-semibold">
                <House className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="line-clamp-1">{property.layout}</span>
              </span>
            ) : null}
            {primarySize ? (
              <span className="flex min-h-11 items-center gap-2 rounded-lg bg-zinc-100 px-3 font-semibold">
                <Ruler className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                {primarySize}
              </span>
            ) : null}
          </div>

          {areaItems.length > 1 ? (
            <div className="mt-2 grid gap-2 text-xs font-semibold text-zinc-600 sm:grid-cols-2">
              {areaItems.slice(0, 2).map((area) => (
                <span key={area.key} className="rounded-lg bg-zinc-50 px-3 py-2">
                  {area.shortLabel}: {area.value}
                </span>
              ))}
            </div>
          ) : null}

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-600">
            {property.shortDescription}
          </p>

          <div className="mt-4 grid gap-2 text-xs text-zinc-600">
            {featurePreview.length ? (
              <div className="flex flex-wrap gap-2">
                {featurePreview.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-900"
                  >
                    <Check className="h-3 w-3" aria-hidden="true" />
                    {feature}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-auto pt-5">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-3 py-2.5 text-sm font-semibold text-ink transition group-hover:bg-brand-700 group-hover:text-white">
              Zobrazit detail
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
