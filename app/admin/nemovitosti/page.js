import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              SMAR Reality
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Administrace nemovitostí
            </h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Správa nabídek, fotografií, videí a detailů nemovitostí pro web
              SMAR Reality.
            </p>
          </div>
        </div>
      </section>

      <AdminPropertyForm />
    </div>
  );
}
