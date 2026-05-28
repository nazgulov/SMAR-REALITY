import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-zinc-600 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <BrandLogo compact />
          <p className="mt-3 max-w-md leading-6">
            Wireframe realitního webu připravený pro nabídky k prodeji a
            pronájmu, virtuální prohlídky a budoucí administrační rozhraní.
          </p>
        </div>
        <div>
          <p className="font-semibold text-ink">Navigace</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link className="hover:text-brand-700" href="/">
              Přehled nemovitostí
            </Link>
            <Link className="hover:text-brand-700" href="/sprava-nemovitosti">
              Jak přidávat nemovitosti
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-ink">Kontakt</p>
          <div className="mt-3 flex flex-col gap-2">
            <a className="hover:text-brand-700" href="mailto:info@smar.cz">
              info@smar.cz
            </a>
            <span>Praha, Česká republika</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
