import { ExternalLink } from "lucide-react";

export default function MatterportEmbed({ url, title }) {
  const hasMatterportUrl =
    typeof url === "string" &&
    url.startsWith("https://my.matterport.com/show/");

  const placeholder = `
    <html lang="cs">
      <body style="margin:0;font-family:Inter,Arial,sans-serif;background:#0f172a;color:white;display:flex;align-items:center;justify-content:center;height:100vh;">
        <main style="max-width:620px;padding:32px;text-align:center;">
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#5eead4;">Matterport placeholder</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Virtuální prohlídka pro ${title}</h1>
          <p style="margin:0;color:#cbd5e1;line-height:1.6;">Sem se později vloží reálná Matterport URL z pole matterportUrl v data/properties.js.</p>
        </main>
      </body>
    </html>
  `;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">
            Virtuální prohlídka
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink">Matterport</h2>
        </div>
        {hasMatterportUrl ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Otevřít v novém okně
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-zinc-900">
        <iframe
          title={`Matterport prohlídka - ${title}`}
          src={hasMatterportUrl ? url : undefined}
          srcDoc={hasMatterportUrl ? undefined : placeholder}
          allow="fullscreen; xr-spatial-tracking"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </section>
  );
}
