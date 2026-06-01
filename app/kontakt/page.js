import Link from "next/link";
import { ArrowLeft, Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { contactAddress, contactInfo } from "@/data/contact";

export const metadata = {
  title: "Kontakt | SMAR Reality",
  description: "Kontaktní informace společnosti SMAR s.r.o."
};

const contactCards = [
  {
    label: "E-mail",
    value: contactInfo.email,
    href: `mailto:${contactInfo.email}`,
    icon: Mail
  },
  {
    label: "Telefon",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    icon: Phone
  },
  {
    label: "Datová schránka",
    value: contactInfo.dataBox,
    icon: ShieldCheck
  }
];

export default function ContactPage() {
  const mapHref = `https://mapy.com/zakladni?q=${encodeURIComponent(
    contactAddress
  )}`;

  return (
    <div className="bg-slate-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-brand-700 transition hover:text-brand-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Zpět na web
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              SMAR Reality
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Kontakt
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Ozvěte se nám kvůli prodeji, pronájmu nebo prohlídce vybrané
              nemovitosti.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <Building2 className="h-7 w-7 text-brand-700" aria-hidden="true" />
          <h2 className="mt-4 text-2xl font-semibold text-ink">
            {contactInfo.company}
          </h2>
          <div className="mt-5 space-y-2 text-zinc-700">
            {contactInfo.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a
            href={mapHref}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-brand-700 hover:text-white"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Zobrazit na Mapy.com
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {contactCards.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {item.value}
                </p>
              </>
            );

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="focus-ring rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-soft"
              >
                {content}
              </a>
            ) : (
              <div
                key={item.label}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
