import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Globe2,
  Handshake,
  Home,
  ShieldCheck,
  Users
} from "lucide-react";

export const metadata = {
  title: "Pro makléře | SMAR Reality",
  description:
    "Spolupráce pro realitní makléře: vlastní realitní portál a zveřejnění nabídek pod záštitou SMAR s.r.o."
};

const benefits = [
  {
    title: "Vlastní realitní portál",
    description:
      "Pomůžeme připravit samostatnou prezentaci nabídky, kterou lze postupně rozšířit o administraci, databázi, fotogalerie, mapy a virtuální prohlídky.",
    icon: Globe2
  },
  {
    title: "Nabídky na SMAR Reality",
    description:
      "Vybrané nemovitosti mohou být zveřejněny na portálu SMAR Reality pod záštitou společnosti SMAR s.r.o. a v jednotném profesionálním vzhledu.",
    icon: Home
  },
  {
    title: "Technické zázemí bez složitostí",
    description:
      "Makléř se může soustředit na obchod a klienty. Technická stránka webu, struktura dat a další rozvoj portálu se řeší samostatně podle potřeb.",
    icon: ShieldCheck
  }
];

const cooperationSteps = [
  "Krátce si ujasníme typ spolupráce a cílovou nabídku.",
  "Navrhneme rozsah portálu, způsob zadávání nemovitostí a podobu prezentace.",
  "Připravíme startovní verzi, kterou půjde později rozšiřovat podle růstu nabídky.",
  "U domluvených nemovitostí zajistíme zveřejnění na SMAR Reality."
];

const collaborationOptions = [
  "webová prezentace pro samostatného makléře",
  "zveřejnění vybraných nemovitostí na portálu SMAR Reality",
  "správa fotek, popisů, map a virtuálních prohlídek",
  "příprava na budoucí databázi a administrační rozhraní",
  "dlouhodobá technická podpora a rozšiřování funkcí"
];

export default function BrokersPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Spolupráce
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Pro realitní makléře, kteří chtějí moderní vlastní prezentaci
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              SMAR s.r.o. nabízí spolupráci makléřům, kteří chtějí vlastní
              realitní portál, profesionální prezentaci nemovitostí a možnost
              zveřejnit vybrané nabídky na portálu SMAR Reality.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/kontakt"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-900"
              >
                Domluvit spolupráci
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#moznosti"
                className="focus-ring inline-flex items-center justify-center rounded-lg bg-zinc-100 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-zinc-200"
              >
                Zobrazit možnosti
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-slate-50 p-6 shadow-sm">
            <Handshake className="h-8 w-8 text-brand-700" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-ink">
              Partnerství bez pevného balíčku
            </h2>
            <p className="mt-3 leading-7 text-zinc-600">
              Každý makléř pracuje jinak. Proto se rozsah spolupráce i cena
              řeší individuálně podle počtu nemovitostí, požadované techniky a
              úrovně správy.
            </p>
            <div className="mt-6 rounded-lg bg-white p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
                Cena
              </p>
              <p className="mt-2 text-2xl font-semibold text-ink">Dohodou</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Po krátké konzultaci připravíme doporučený rozsah a férový
                návrh spolupráce.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="moznosti"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Co získáte
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            Jednoduchý start, profesionální výstup
          </h2>
          <p className="mt-3 leading-7 text-zinc-600">
            Cílem není složitý systém na začátku, ale funkční prezentace, která
            pomůže makléři důvěryhodně ukázat nabídku a růst spolu s ní.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-zinc-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Možnosti spolupráce
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              Vybereme rozsah podle toho, co má dávat obchodně smysl
            </h2>
            <p className="mt-4 leading-7 text-zinc-600">
              Spolupráce může začít jednoduchým zveřejněním nabídky, nebo vést
              k vlastnímu portálu pro samostatného makléře či menší tým.
            </p>
          </div>

          <div className="grid gap-3">
            {collaborationOptions.map((option) => (
              <div
                key={option}
                className="flex gap-3 rounded-lg border border-zinc-200 bg-slate-50 px-4 py-3 text-zinc-700"
              >
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-700"
                  aria-hidden="true"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <Users className="h-7 w-7 text-brand-700" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-semibold text-ink">
            Jak spolupráce probíhá
          </h2>
          <ol className="mt-6 space-y-4">
            {cooperationSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 leading-7 text-zinc-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg bg-ink p-6 text-white shadow-soft">
          <Building2 className="h-7 w-7 text-teal-200" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-semibold">
            Chcete prezentovat nabídky profesionálně?
          </h2>
          <p className="mt-4 leading-7 text-zinc-300">
            Ozvěte se s krátkým popisem toho, kolik nemovitostí řešíte, jaký
            typ prezentace potřebujete a zda chcete pouze zveřejnění nabídky,
            nebo vlastní portál.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-zinc-200">
            <div className="flex gap-3">
              <BadgeCheck className="h-5 w-5 shrink-0 text-teal-200" />
              <span>vhodné pro samostatné makléře i menší realitní týmy</span>
            </div>
            <div className="flex gap-3">
              <BadgeCheck className="h-5 w-5 shrink-0 text-teal-200" />
              <span>rozsah i cena se řeší individuálně podle potřeb</span>
            </div>
          </div>
          <Link
            href="/kontakt"
            className="focus-ring mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Kontaktovat SMAR
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
