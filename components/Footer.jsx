import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { contactInfo } from "@/data/contact";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-zinc-600 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <BrandLogo compact />
          <p className="mt-3 max-w-md leading-6">
            Realitní služby pro prodej a pronájem nemovitostí s osobním
            přístupem a přehlednou prezentací nabídky.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">Navigace</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link className="hover:text-brand-700" href="/">
              Přehled nemovitostí
            </Link>
            <Link className="hover:text-brand-700" href="/pro-maklere">
              Pro makléře
            </Link>
            <Link className="hover:text-brand-700" href="/kontakt">
              Kontakt
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-ink">Kontakt</p>
          <div className="mt-3 flex flex-col gap-2">
            <a
              className="hover:text-brand-700"
              href={`mailto:${contactInfo.email}`}
            >
              {contactInfo.email}
            </a>
            <a
              className="hover:text-brand-700"
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
            >
              {contactInfo.phone}
            </a>
            <span>{contactInfo.company}</span>
            {contactInfo.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span>Datová schránka: {contactInfo.dataBox}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>2026 SMAR s.r.o.</p>
          <p>
            Stránku vytvořila firma{" "}
            <a
              href="https://www.smar.cz"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-brand-700 transition hover:text-brand-900"
            >
              SMAR s.r.o.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
