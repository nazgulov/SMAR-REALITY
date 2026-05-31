export function fromSupabaseProperty(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    price: row.price,
    location: row.location,
    size: row.size,
    layout: row.layout,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    gallery: row.gallery?.length ? row.gallery : [row.image].filter(Boolean),
    matterportUrl: row.matterport_url ?? "",
    mapUrl: row.map_url ?? "",
    features: row.features ?? []
  };
}

export function toSupabaseProperty(property) {
  return {
    id: property.id,
    title: property.title,
    type: property.type,
    price: property.price,
    location: property.location,
    size: property.size,
    layout: property.layout,
    short_description: property.shortDescription,
    description: property.description,
    image: property.image,
    gallery: property.gallery ?? [],
    matterport_url: property.matterportUrl ?? "",
    map_url: property.mapUrl ?? "",
    features: property.features ?? [],
    published: true
  };
}
