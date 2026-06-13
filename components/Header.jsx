import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { href: "/", label: "Nemovitosti" },
  { href: "/pro-maklere", label: "Pro makléře" },
  { href: "/admin/nemovitosti", label: "Administrace" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-ring flex items-center gap-3 rounded-lg text-ink"
          aria-label="SMAR s.r.o. úvodní stránka"
        >
          <BrandLogo />
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-lg px-3 py-2 transition hover:bg-zinc-100 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="focus-ring rounded-lg bg-brand-700 px-4 py-2 text-white transition hover:bg-brand-900"
          >
            Kontakt
          </Link>
        </nav>
      </div>
    </header>
  );
}
