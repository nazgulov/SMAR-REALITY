export function normalizeVideoInput(value) {
  const trimmed = value?.trim?.() ?? "";

  if (!trimmed) {
    return "";
  }

  const iframeSrc = trimmed.match(/src=["']([^"']+)["']/i)?.[1];
  return iframeSrc?.trim() || trimmed;
}

export function getEmbeddableVideoUrl(value) {
  const normalized = normalizeVideoInput(value);

  if (!normalized) {
    return "";
  }

  if (!/^https?:\/\//i.test(normalized)) {
    return "";
  }

  try {
    const url = new URL(normalized);
    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : normalized;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId =
        url.searchParams.get("v") ||
        url.pathname.match(/\/(shorts|embed)\/([^/?#]+)/)?.[2];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : normalized;
    }

    if (host === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : normalized;
    }

    return normalized;
  } catch {
    return normalized;
  }
}

export function isDirectVideoUrl(value) {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(normalizeVideoInput(value));
}
