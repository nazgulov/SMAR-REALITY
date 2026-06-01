export function fromSupabaseProperty(row) {
  const usableArea = row.usable_area ?? row.size ?? "";

  return {
    id: row.id,
    title: row.title,
    type: row.type,
    price: row.price,
    location: row.location,
    size: row.size,
    plotArea: row.plot_area ?? "",
    usableArea,
    builtUpArea: row.built_up_area ?? "",
    layout: row.layout,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    gallery: row.gallery?.length ? row.gallery : [row.image].filter(Boolean),
    matterportUrl: row.matterport_url ?? "",
    mapUrl: row.map_url ?? "",
    features: row.features ?? [],
    createdAt: row.created_at ?? ""
  };
}

export function toSupabaseProperty(property) {
  const usableArea = property.usableArea ?? property.size ?? "";

  return {
    id: property.id,
    title: property.title,
    type: property.type,
    price: property.price,
    location: property.location,
    size: property.size || usableArea || property.plotArea || property.builtUpArea || "",
    plot_area: property.plotArea ?? "",
    usable_area: usableArea,
    built_up_area: property.builtUpArea ?? "",
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
