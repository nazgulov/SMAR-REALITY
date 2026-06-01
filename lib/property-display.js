export const areaFields = [
  { key: "usableArea", label: "Užitná plocha", shortLabel: "Užitná" },
  { key: "plotArea", label: "Plocha pozemku", shortLabel: "Pozemek" },
  { key: "builtUpArea", label: "Zastavěná plocha", shortLabel: "Zastavěná" }
];

export function getAreaItems(property) {
  const areas = areaFields
    .map((field) => ({
      ...field,
      value: property[field.key]?.trim?.() ?? ""
    }))
    .filter((field) => field.value);

  if (areas.length) {
    return areas;
  }

  return property.size
    ? [{ key: "size", label: "Plocha", shortLabel: "Plocha", value: property.size }]
    : [];
}

export function getPrimarySizeLabel(property) {
  const areas = getAreaItems(property);
  const usableArea = areas.find((area) => area.key === "usableArea");
  const firstArea = usableArea ?? areas[0];
  return firstArea?.value ?? "";
}

export function formatPropertyDate(createdAt) {
  if (!createdAt) {
    return "";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(date);
}
