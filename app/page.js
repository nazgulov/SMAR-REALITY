import Link from "next/link";
import { ArrowDown, Building2, KeyRound } from "lucide-react";
import PropertyGrid from "@/components/PropertyGrid";
import SectionTitle from "@/components/SectionTitle";
import { getPropertiesByType, properties } from "@/data/properties";

export default function HomePage() {
  const saleProperties = getPropertiesByType("prodej");
  const rentalProperties = getPropertiesByType("pronajem");

  return (
    <div className="bg-slate-50">
      <section
        className="relative min-h-[560px] overflow-hidden bg-ink text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.32)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=85')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
              SMAR s.r.o.
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Reality SMAR
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-100">
              Moderní realitní prezentace pro prodej a pronájem nemovitostí s
              přehlednými detaily, fotogalerií a prostorem pro virtuální
              Matterport prohlídky.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#nabidky"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Prohlédnout nabídky
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/sprava-nemovitosti"
                className="focus-ring inline-flex items-center justify-center rounded-lg bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Jak přidávat nemovitosti
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-ink">
                {properties.length}
              </p>
              <p className="text-sm text-zinc-500">Ukázkových nemovitostí</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-brand-700">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-ink">
                {saleProperties.length}
              </p>
              <p className="text-sm text-zinc-500">Nabídky k prodeji</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-2xl font-semibold text-ink">
                {rentalProperties.length}
              </p>
              <p className="text-sm text-zinc-500">Nabídky k pronájmu</p>
            </div>
          </div>
        </div>
      </section>

      <section id="nabidky" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Přehled"
          title="Vybrané nemovitosti"
          description="Nabídky jsou zatím uložené v lokálním souboru mock dat. Struktura je připravená tak, aby šla později nahradit API nebo databází."
        />

        <div className="mt-10 space-y-14">
          <section>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Prodej</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Rodinné domy, byty a rekreační objekty ke koupi.
                </p>
              </div>
              <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                {saleProperties.length} nabídky
              </span>
            </div>
            <PropertyGrid properties={saleProperties} />
          </section>

          <section>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Pronájem</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Byty, ateliéry a komerční prostory k dlouhodobému pronájmu.
                </p>
              </div>
              <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                {rentalProperties.length} nabídky
              </span>
            </div>
            <PropertyGrid properties={rentalProperties} />
          </section>
        </div>
      </section>
    </div>
  );
}
