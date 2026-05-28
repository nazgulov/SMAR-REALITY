import Link from "next/link";
import { ArrowLeft, CheckCircle2, Database, FileCode2, LockKeyhole } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const exampleProperty = `{
  id: "novy-byt-praha",
  title: "Nový byt 2+kk",
  type: "prodej",
  price: "8 900 000 Kč",
  location: "Praha",
  size: "61 m²",
  layout: "2+kk, byt",
  shortDescription: "Krátký popis pro kartu nemovitosti.",
  description: "Delší popis pro detail nemovitosti.",
  image: "https://images.unsplash.com/...",
  gallery: ["https://images.unsplash.com/...", "https://images.unsplash.com/..."],
  matterportUrl: "https://my.matterport.com/show/?m=REALNE_ID",
  features: ["Balkon", "Sklep", "Parkování"]
}`;

export const metadata = {
  title: "Jak přidávat nemovitosti | SMAR s.r.o.",
  description:
    "Postup pro přidávání nemovitostí do wireframe webu a doporučený další vývoj administrace."
};

export default function PropertyManagementPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zpět na přehled
          </Link>
          <div className="mt-8">
            <SectionTitle
              eyebrow="Správa obsahu"
              title="Jak přidávat nemovitosti"
              description="Tato stránka popisuje aktuální práci s mock daty a doporučený směr pro budoucí administrační rozhraní se Supabase."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="space-y-8">
          <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <FileCode2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-semibold text-ink">
                Dočasné řešení pro wireframe
              </h2>
            </div>
            <p className="mt-5 leading-7 text-zinc-700">
              Nové nemovitosti se nyní přidávají úpravou souboru
              <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                data/properties.js
              </code>
              . Každá nemovitost je jeden objekt v poli
              <code className="mx-1 rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
                properties
              </code>
              .
            </p>
            <ul className="mt-5 space-y-3 text-sm text-zinc-700">
              {[
                "Zkopírujte existující objekt nemovitosti.",
                "Změňte id, název, typ nabídky, cenu, lokalitu, popisy a parametry.",
                "Do image a gallery vložte URL obrázků.",
                "Do matterportUrl vložte finální Matterport odkaz ve tvaru https://my.matterport.com/show/?m=....",
                "Po uložení souboru Next.js automaticky překreslí přehled i detail."
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Database className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-semibold text-ink">
                Budoucí doporučené řešení
              </h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Administrační sekce pro správce obsahu",
                "Přihlášení správce a chráněné routy",
                "Formulář pro přidání nové nemovitosti",
                "Nahrávání obrázků do úložiště",
                "Pole pro vložení Matterport iframe odkazu",
                "Ukládání dat do databáze, například Supabase",
                "Editace publikovaných nabídek",
                "Mazání nebo archivace nemovitostí"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-zinc-200 bg-slate-50 p-4 text-sm font-medium text-zinc-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-ink">Ukázkový objekt</h2>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-xs leading-6 text-zinc-100">
              <code>{exampleProperty}</code>
            </pre>
          </section>

          <section className="rounded-lg bg-brand-900 p-6 text-white shadow-soft">
            <LockKeyhole className="h-7 w-7 text-teal-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Doporučený další krok</h2>
            <p className="mt-3 text-sm leading-6 text-teal-50">
              Po schválení wireframu navrhnout datový model pro tabulku
              properties, připravit Supabase projekt a přidat jednoduchou
              administraci pro správce.
            </p>
          </section>
        </aside>
      </section>
    </div>
  );
}
