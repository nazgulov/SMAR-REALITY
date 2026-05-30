import Link from "next/link";
import { ArrowLeft, Database, ShieldCheck } from "lucide-react";
import AdminPropertyForm from "@/components/AdminPropertyForm";

export const metadata = {
  title: "Administrace nemovitostí | SMAR s.r.o.",
  description:
    "Prototyp administrační sekce pro přidávání a úpravu nemovitostí SMAR Reality."
};

export default function AdminPropertiesPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zpět na web
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                SMAR Reality
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Administrace nemovitostí
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
                Formulář zatím ukládá položky lokálně v prohlížeči. Struktura
                dat odpovídá souboru data/properties.js a je připravená pro
                pozdější napojení na Supabase. Obrázky lze v prototypu nahrát
                z počítače a exportovat společně s daty.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-lg border border-zinc-200 bg-slate-50 p-4">
                <ShieldCheck className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-ink">
                  Prototyp bez přihlášení
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-slate-50 p-4">
                <Database className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-ink">
                  Připraveno pro databázi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdminPropertyForm />
    </div>
  );
}
