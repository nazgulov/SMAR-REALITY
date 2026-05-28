import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { propertyTypeLabels } from "@/data/properties";

const badgeStyles = {
  prodej: "bg-brand-700 text-white",
  pronajem: "bg-amber-500 text-zinc-950"
};

export default function PropertyCard({ property }) {
  const typeLabel = propertyTypeLabels[property.type] ?? property.type;

  return (
    <Link
      href={`/nemovitosti/${property.id}`}
      className="focus-ring group block rounded-lg"
      aria-label={`Zobrazit detail: ${property.title}`}
    >
      <article className="h-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-soft">
        <div className="relative h-56 overflow-hidden bg-zinc-200">
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
        </div>
        <div className="flex h-[calc(100%-14rem)] flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold leading-6 text-ink">
                {property.title}
              </h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="h-4 w-4 shrink-0 text-brand-700" />
                {property.location}
              </p>
            </div>
          </div>
          <p className="mt-4 text-xl font-semibold text-brand-900">
            {property.price}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
            {property.shortDescription}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="text-sm text-zinc-500">
              {property.size} · {property.layout}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-ink transition group-hover:bg-brand-700 group-hover:text-white">
              Zobrazit detail
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
