"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import PropertyGrid from "@/components/PropertyGrid";

const typeFilters = [
  { value: "vse", label: "Vše" },
  { value: "prodej", label: "Prodej" },
  { value: "pronajem", label: "Pronájem" }
];

const priceRanges = [
  { value: "", label: "Cena" },
  { value: "rent-30000", label: "Pronájem do 30 000 Kč" },
  { value: "rent-50000", label: "Pronájem do 50 000 Kč" },
  { value: "sale-10000000", label: "Prodej do 10 mil. Kč" },
  { value: "sale-20000000", label: "Prodej 10-20 mil. Kč" },
  { value: "sale-20000000-plus", label: "Prodej nad 20 mil. Kč" }
];

function normalizeText(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parsePrice(price) {
  return Number.parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

function getLayoutLabel(property) {
  return property.layout?.split(",")[0]?.trim() || property.layout || "";
}

function matchesPriceRange(property, range) {
  const price = parsePrice(property.price);

  switch (range) {
    case "rent-30000":
      return property.type === "pronajem" && price <= 30000;
    case "rent-50000":
      return property.type === "pronajem" && price <= 50000;
    case "sale-10000000":
      return property.type === "prodej" && price <= 10000000;
    case "sale-20000000":
      return property.type === "prodej" && price > 10000000 && price <= 20000000;
    case "sale-20000000-plus":
      return property.type === "prodej" && price > 20000000;
    default:
      return true;
  }
}

export default function HomePropertyBrowser({ properties }) {
  const [type, setType] = useState("vse");
  const [location, setLocation] = useState("");
  const [layout, setLayout] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const layoutOptions = useMemo(() => {
    const layouts = properties
      .map(getLayoutLabel)
      .filter(Boolean)
      .filter((value, index, all) => all.indexOf(value) === index);

    return layouts.sort((a, b) => a.localeCompare(b, "cs"));
  }, [properties]);

  const counts = useMemo(
    () => ({
      vse: properties.length,
      prodej: properties.filter((property) => property.type === "prodej").length,
      pronajem: properties.filter((property) => property.type === "pronajem").length
    }),
    [properties]
  );

  const filteredProperties = useMemo(() => {
    const normalizedLocation = normalizeText(location.trim());

    return properties.filter((property) => {
      const propertyLayout = getLayoutLabel(property);
      const locationMatch = normalizedLocation
        ? normalizeText(property.location).includes(normalizedLocation)
        : true;

      return (
        (type === "vse" || property.type === type) &&
        locationMatch &&
        (!layout || propertyLayout === layout) &&
        matchesPriceRange(property, priceRange)
      );
    });
  }, [layout, location, priceRange, properties, type]);

  const hasActiveFilters =
    type !== "vse" || location || layout || priceRange;

  function clearFilters() {
    setType("vse");
    setLocation("");
    setLayout("");
    setPriceRange("");
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <SlidersHorizontal className="h-4 w-4 text-brand-700" aria-hidden="true" />
              Filtr nabídky
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
              <label className="relative block">
                <span className="sr-only">Lokalita</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Lokalita"
                  className="focus-ring h-11 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 text-sm text-ink shadow-sm placeholder:text-zinc-400"
                />
              </label>
              <label>
                <span className="sr-only">Dispozice</span>
                <select
                  value={layout}
                  onChange={(event) => setLayout(event.target.value)}
                  className="focus-ring h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-ink shadow-sm"
                >
                  <option value="">Dispozice</option>
                  {layoutOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Cena</span>
                <select
                  value={priceRange}
                  onChange={(event) => setPriceRange(event.target.value)}
                  className="focus-ring h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-ink shadow-sm"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value || "all"} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setType(filter.value)}
                className={`focus-ring inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
                  type === filter.value
                    ? "bg-brand-700 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {filter.label}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    type === filter.value
                      ? "bg-white/20 text-white"
                      : "bg-white text-zinc-600"
                  }`}
                >
                  {counts[filter.value]}
                </span>
              </button>
            ))}
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Vyčistit
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-zinc-600">
          Zobrazeno {filteredProperties.length} z {properties.length} nemovitostí
        </p>
      </div>

      <PropertyGrid properties={filteredProperties} />
    </div>
  );
}
