import { PlayCircle } from "lucide-react";
import { getEmbeddableVideoUrl, isDirectVideoUrl } from "@/lib/video-utils";

export default function VideoEmbed({ url, title }) {
  const videoUrl = getEmbeddableVideoUrl(url);

  if (!videoUrl) {
    return null;
  }

  const videoTitle = `Video prohlídka - ${title}`;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <PlayCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
            Video
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink">
            Video prohlídka
          </h2>
        </div>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg bg-zinc-950">
        {isDirectVideoUrl(videoUrl) ? (
          <video controls className="h-full w-full" title={videoTitle}>
            <source src={videoUrl} />
          </video>
        ) : (
          <iframe
            title={videoTitle}
            src={videoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        )}
      </div>
    </section>
  );
}
