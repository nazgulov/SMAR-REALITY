import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  Mail,
  MapPin,
  Ruler,
  Tag
} from "lucide-react";
import MatterportEmbed from "@/components/MatterportEmbed";
import MapEmbed from "@/components/MapEmbed";
import VideoEmbed from "@/components/VideoEmbed";
import { propertyTypeLabels } from "@/data/properties";
import { formatPropertyDate, getAreaItems } from "@/lib/property-display";

const badgeStyles = {
  prodej: "bg-brand-700 text-white",
  pronajem: "bg-amber-500 text-zinc-950"
};

export default function PropertyDetail({ property }) {
  const typeLabel = propertyTypeLabels[property.type] ?? property.type;
  const createdDate = formatPropertyDate(property.createdAt);
  const areaStats = getAreaItems(property).map((area) => ({
    label: area.label,
    value: area.value,
    icon: Ruler
  }));

  const stats = [
    { label: "Lokalita", value: property.location, icon: MapPin },
    ...areaStats,
    { label: "Dispozice / typ", value: property.layout, icon: Building2 },
    { label: "Typ nabídky", value: typeLabel, icon: Tag },
    ...(createdDate
      ? [
          {
            label: "Vloženo na portál",
            value: createdDate,
            icon: CalendarDays
          }
        ]
      : [])
  ];

  return (
    <div className="bg-slate-50">
      <section className="relative min-h-[460px] overflow-hidden bg-ink text-white">
        <Image
          src={property.image}
          alt={property.title}
          fill
          priority
          className="object-cover opacity-65"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col justify-end px-4 pb-10 pt-20 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="focus-ring mb-8 inline-flex w-fit items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zpět na přehled
          </Link>
          <span
            className={`mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${badgeStyles[property.type]}`}
          >
            {typeLabel}
          </span>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {property.title}
            </h1>
            <p className="mt-4 flex items-center gap-2 text-lg text-zinc-100">
              <MapPin className="h-5 w-5 text-teal-200" aria-hidden="true" />
              {property.location}
            </p>
            <p className="mt-5 text-3xl font-semibold text-teal-100">
              {property.price}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                  <p className="mt-4 text-sm text-zinc-500">{item.label}</p>
                  <p className="mt-1 font-semibold text-ink">{item.value}</p>
                </div>
              );
            })}
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-ink">Popis nemovitosti</h2>
            <p className="mt-4 leading-8 text-zinc-700">
              {property.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ink">Fotogalerie</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {property.gallery.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200"
                >
                  <Image
                    src={image}
                    alt={`${property.title} - galerie ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 33vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>

          {property.floorPlan ? (
            <section>
              <h2 className="text-2xl font-semibold text-ink">Půdorys</h2>
              <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <div className="relative aspect-[4/3] bg-zinc-50">
                  <Image
                    src={property.floorPlan}
                    alt={`Půdorys - ${property.title}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 62vw, 100vw"
                  />
                </div>
              </div>
            </section>
          ) : null}

          <MapEmbed
            mapUrl={property.mapUrl}
            location={property.location}
            title={property.title}
          />

          <VideoEmbed url={property.videoUrl} title={property.title} />

          <MatterportEmbed url={property.matterportUrl} title={property.title} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">Hlavní parametry</h2>
            <ul className="mt-5 space-y-3">
              {property.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm text-zinc-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg bg-ink p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.16em] text-teal-200">
              Máte zájem?
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Kontaktujte SMAR</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Domluvte si prohlídku, ověřte dostupnost nebo požádejte o další
              informace k této nemovitosti.
            </p>
            <Link
              href={`/kontakt?nemovitost=${property.id}`}
              className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Kontaktovat nás
            </Link>
          </section>
        </aside>
      </section>
    </div>
  );
}
