import { notFound } from "next/navigation";
import PropertyDetail from "@/components/PropertyDetail";
import { getPropertyById } from "@/lib/properties";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "Nemovitost nenalezena | SMAR s.r.o."
    };
  }

  return {
    title: `${property.title} | SMAR s.r.o.`,
    description: property.shortDescription
  };
}

export default async function PropertyPage({ params }) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}
