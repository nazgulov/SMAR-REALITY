import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Info,
  KeyRound,
  Mail,
  Users
} from "lucide-react";
import HomePropertyBrowser from "@/components/HomePropertyBrowser";
import SectionTitle from "@/components/SectionTitle";
import { getAllProperties, getPropertiesByType } from "@/lib/properties";

const heroImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=85";

export default async function HomePage() {
  const properties = await getAllProperties();
  const saleProperties = getPropertiesByType(properties, "prodej");
  const rentalProperties = getPropertiesByType(properties, "pronajem");

  return (
    <div className="bg-slate-50">
      <section className="relative min-h-[500px] overflow-hidden bg-ink text-white">
        <Image
          src={heroImage}
          alt="Hezký moderní rodinný dům"
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[500px] max-w-7xl flex-col justify-end px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
              SMAR s.r.o.
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Reality SMAR
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-100">
              Prodej a pronájem nemovitostí s osobním přístupem, přehlednými
              detaily, fotogalerií a virtuálními prohlídkami tam, kde dávají
              smysl.
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
                href="/kontakt"
                className="focus-ring inline-flex items-center justify-center rounded-lg bg-white/12 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Kontaktovat SMAR
                <Mail className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <Link
              href="/pro-maklere"
              className="focus-ring mt-5 inline-flex max-w-full items-start gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm font-medium text-zinc-100 backdrop-blur transition hover:bg-white/15 hover:text-white sm:items-center"
            >
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-teal-200 sm:mt-0" aria-hidden="true" />
              <span className="min-w-0 leading-5">
                Pro makléře: vlastní portál a zveřejnění nabídky pod SMAR Reality
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto flex max-w-7xl gap-3 px-4 py-4 text-sm text-amber-950 sm:px-6 lg:px-8">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="font-semibold">Testovací verze webu</p>
            <p className="mt-1 leading-6">
              Tento web neslouží k ostrému provozu. Jde pouze o testovací
              stránku na dočasné doméně.
            </p>
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
              <p className="text-sm text-zinc-500">Aktuálních nemovitostí</p>
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

      <section
        id="nabidky"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <SectionTitle
          eyebrow="Aktuální nabídka"
          title="Nemovitosti k prodeji a pronájmu"
          description="Vyberte si typ nabídky, lokalitu, dispozici nebo cenový rozsah. Detail každé nemovitosti obsahuje parametry, fotogalerii, mapu a prostor pro virtuální prohlídku."
        />

        <HomePropertyBrowser properties={properties} />
      </section>
    </div>
  );
}
