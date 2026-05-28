import PropertyCard from "@/components/PropertyCard";

export default function PropertyGrid({ properties }) {
  if (!properties.length) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        V této kategorii zatím nejsou žádné nemovitosti.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
