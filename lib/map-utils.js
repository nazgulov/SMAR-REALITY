const mapyPageHosts = new Set([
  "mapy.com",
  "www.mapy.com",
  "mapy.cz",
  "www.mapy.cz"
]);
const mapyFrameHosts = new Set(["frame.mapy.cz"]);

function extractIframeSrc(value) {
  const quotedMatch = value.match(/\ssrc=(["'])(.*?)\1/i);

  if (quotedMatch?.[2]) {
    return quotedMatch[2];
  }

  const plainMatch = value.match(/\ssrc=([^\s>]+)/i);
  return plainMatch?.[1] ?? "";
}

export function toMapySearchUrl(value) {
  return `https://mapy.com/zakladni?q=${encodeURIComponent(value.trim())}`;
}

function isShortSharePath(pathname) {
  return pathname === "/s" || pathname.startsWith("/s/");
}

function toFrameUrl(url) {
  return `https://frame.mapy.cz${url.pathname}${url.search}`;
}

function toPageUrl(url) {
  return `https://mapy.com${url.pathname}${url.search}`;
}

function getCandidate(value) {
  const trimmed = value?.trim() ?? "";
  const iframeSrc = extractIframeSrc(trimmed);
  const candidate = iframeSrc || trimmed;
  return candidate.startsWith("//") ? `https:${candidate}` : candidate;
}

export function isMapyUrl(value) {
  try {
    const url = new URL(value);
    return mapyPageHosts.has(url.hostname) || mapyFrameHosts.has(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeMapInput(value) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  const candidate = getCandidate(trimmed);

  try {
    const url = new URL(candidate);

    if (mapyFrameHosts.has(url.hostname)) {
      return url.toString();
    }

    if (mapyPageHosts.has(url.hostname)) {
      return isShortSharePath(url.pathname) ? toFrameUrl(url) : url.toString();
    }

    return "";
  } catch {
    return toMapySearchUrl(trimmed);
  }
}

export function getMapEmbedUrl(mapUrl) {
  const normalized = normalizeMapInput(mapUrl);

  if (!normalized) {
    return "";
  }

  try {
    const url = new URL(normalized);

    if (mapyFrameHosts.has(url.hostname)) {
      return url.toString();
    }

    if (mapyPageHosts.has(url.hostname) && isShortSharePath(url.pathname)) {
      return toFrameUrl(url);
    }
  } catch {
    return "";
  }

  return "";
}

export function getMapOpenUrl(mapUrl, fallbackAddress) {
  const normalized = normalizeMapInput(mapUrl);

  if (normalized) {
    try {
      const url = new URL(normalized);

      if (mapyFrameHosts.has(url.hostname)) {
        return toPageUrl(url);
      }

      if (mapyPageHosts.has(url.hostname)) {
        return url.toString();
      }
    } catch {
      return toMapySearchUrl(normalized);
    }
  }

  return fallbackAddress ? toMapySearchUrl(fallbackAddress) : "";
}
