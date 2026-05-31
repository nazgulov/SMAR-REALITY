const mapyHosts = new Set(["mapy.com", "www.mapy.com", "mapy.cz", "www.mapy.cz"]);

function extractIframeSrc(value) {
  const quotedMatch = value.match(/\ssrc=(["'])(.*?)\1/i);

  if (quotedMatch?.[2]) {
    return quotedMatch[2];
  }

  const plainMatch = value.match(/\ssrc=([^\s>]+)/i);
  return plainMatch?.[1] ?? "";
}

function toMapySearchUrl(value) {
  return `https://mapy.com/zakladni?q=${encodeURIComponent(value.trim())}`;
}

export function isMapyUrl(value) {
  try {
    const url = new URL(value);
    return mapyHosts.has(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeMapInput(value) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  const iframeSrc = extractIframeSrc(trimmed);
  const candidate = iframeSrc || trimmed;
  const candidateUrl = candidate.startsWith("//") ? `https:${candidate}` : candidate;

  try {
    const url = new URL(candidateUrl);
    return mapyHosts.has(url.hostname) ? url.toString() : "";
  } catch {
    return toMapySearchUrl(trimmed);
  }
}

export function getMapEmbedUrl(mapUrl, fallbackAddress) {
  return normalizeMapInput(mapUrl) || normalizeMapInput(fallbackAddress);
}
