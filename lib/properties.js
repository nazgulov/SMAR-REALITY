import { unstable_noStore as noStore } from "next/cache";
import {
  getSupabaseServerClient,
  hasSupabaseConfig
} from "@/lib/supabase/client";
import { fromSupabaseProperty } from "@/lib/property-mappers";
import { properties as fallbackProperties } from "@/data/properties";

const selectProperties = `
  id,
  title,
  type,
  price,
  location,
  size,
  layout,
  short_description,
  description,
  image,
  gallery,
  matterport_url,
  features,
  published,
  created_at
`;

function useLiveSupabaseData() {
  return process.env.GITHUB_PAGES !== "true" && hasSupabaseConfig();
}

function useFallback(error) {
  if (error) {
    console.warn("Supabase properties fallback:", error.message);
  }

  return fallbackProperties;
}

export async function getAllProperties() {
  if (!useLiveSupabaseData()) {
    return fallbackProperties;
  }

  noStore();

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select(selectProperties)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return useFallback(error);
  }

  return data.map(fromSupabaseProperty);
}

export async function getPropertyById(id) {
  if (!useLiveSupabaseData()) {
    return fallbackProperties.find((property) => property.id === id);
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select(selectProperties)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    return fallbackProperties.find((property) => property.id === id);
  }

  return data ? fromSupabaseProperty(data) : undefined;
}

export function getPropertiesByType(properties, type) {
  return properties.filter((property) => property.type === type);
}
