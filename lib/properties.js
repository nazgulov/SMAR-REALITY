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
  plot_area,
  usable_area,
  built_up_area,
  layout,
  short_description,
  description,
  image,
  gallery,
  matterport_url,
  map_url,
  features,
  published,
  created_at
`;

const selectPropertiesBase = `
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

function isMissingMapColumn(error) {
  return error?.message?.includes("map_url");
}

function isMissingAreaColumn(error) {
  return (
    error?.message?.includes("plot_area") ||
    error?.message?.includes("usable_area") ||
    error?.message?.includes("built_up_area")
  );
}

async function fetchProperties(queryBuilder) {
  let { data, error } = await queryBuilder(selectProperties);

  if (isMissingMapColumn(error) || isMissingAreaColumn(error)) {
    const fallback = await queryBuilder(selectPropertiesBase);
    data = fallback.data;
    error = fallback.error;
  }

  return { data, error };
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
  const { data, error } = await fetchProperties((select) =>
    supabase
      .from("properties")
      .select(select)
      .eq("published", true)
      .order("created_at", { ascending: false })
  );

  if (error) {
    return useFallback(error);
  }

  return data.map(fromSupabaseProperty);
}

export async function getPropertyById(id) {
  if (!useLiveSupabaseData()) {
    return fallbackProperties.find((property) => property.id === id);
  }

  noStore();

  const supabase = getSupabaseServerClient();
  const { data, error } = await fetchProperties((select) =>
    supabase
      .from("properties")
      .select(select)
      .eq("id", id)
      .eq("published", true)
      .maybeSingle()
  );

  if (error) {
    return fallbackProperties.find((property) => property.id === id);
  }

  return data ? fromSupabaseProperty(data) : undefined;
}

export function getPropertiesByType(properties, type) {
  return properties.filter((property) => property.type === type);
}
