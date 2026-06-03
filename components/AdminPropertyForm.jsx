"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ImagePlus,
  LogIn,
  LogOut,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCw,
  Save,
  Trash2
} from "lucide-react";
import { propertyTypeLabels } from "@/data/properties";
import {
  getSupabaseConfigIssue,
  getStorageBucketName,
  getSupabaseBrowserClient,
  hasSupabaseConfig
} from "@/lib/supabase/client";
import {
  fromSupabaseProperty,
  toSupabaseProperty
} from "@/lib/property-mappers";
import { normalizeMapInput } from "@/lib/map-utils";
import { formatPropertyDate, getAreaItems } from "@/lib/property-display";
import { normalizeVideoInput } from "@/lib/video-utils";

const STORAGE_KEY = "smar-admin-properties";
const supabaseConfigIssue = getSupabaseConfigIssue();
const supabaseEnabled = hasSupabaseConfig();
const adminSelect =
  "id,title,type,price,location,size,plot_area,usable_area,built_up_area,layout,short_description,description,image,gallery,matterport_url,video_url,map_url,features,published,created_at";
const adminSelectWithoutVideo =
  "id,title,type,price,location,size,plot_area,usable_area,built_up_area,layout,short_description,description,image,gallery,matterport_url,map_url,features,published,created_at";
const adminSelectBase =
  "id,title,type,price,location,size,layout,short_description,description,image,gallery,matterport_url,features,published,created_at";

const emptyForm = {
  id: "",
  title: "",
  type: "prodej",
  price: "",
  location: "",
  size: "50 m²",
  plotArea: "",
  usableArea: "50",
  builtUpArea: "",
  layout: "1+kk, byt",
  shortDescription: "",
  description: "",
  image: "",
  gallery: "",
  matterportUrl: "",
  videoUrl: "",
  mapUrl: "",
  features: "",
  createdAt: ""
};

const sampleImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

const areaOptions = [
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
  "58",
  "60",
  "64",
  "65",
  "70",
  "75",
  "80",
  "86",
  "90",
  "100",
  "112",
  "120",
  "124",
  "150",
  "180",
  "182",
  "200",
  "250",
  "300",
  "400",
  "500",
  "620",
  "750",
  "980",
  "1 200"
];

const layoutOptions = [
  "1+kk, byt",
  "1+1, byt",
  "2+kk, byt",
  "2+1, byt",
  "3+kk, byt",
  "3+1, byt",
  "4+kk, byt",
  "4+1, byt",
  "5+kk, rodinný dům",
  "5+1, rodinný dům",
  "rodinný dům",
  "rekreační objekt",
  "kanceláře, komerční prostor",
  "ateliér"
];

const featureOptions = [
  "Balkon",
  "Sklep",
  "Parkovací stání",
  "Garáž",
  "Terasa",
  "Lodžie",
  "Zahrada",
  "Předzahrádka",
  "Komora",
  "Šatna",
  "Výtah",
  "Bezbariérový přístup",
  "Klimatizace",
  "Tepelné čerpadlo",
  "Fotovoltaika",
  "Krb",
  "Sauna",
  "Bazén",
  "Vlastní studna",
  "Novostavba",
  "Po rekonstrukci",
  "Vybaveno",
  "Internet",
  "MHD v dosahu",
  "Klidná lokalita",
  "K nastěhování ihned"
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function normalizeAreaValue(value) {
  const trimmed = value.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.replace(/\s*m\s*(2|²)$/i, " m²");

  if (/\s*m²$/i.test(normalized)) {
    return normalized;
  }

  return `${normalized} m²`;
}

function getAreaInputValue(value) {
  return value.replace(/\s*m\s*(2|²)$/i, "").trim();
}

function splitLines(value) {
  return value
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueItems(items) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function propertyToForm(property) {
  const usableArea = property.usableArea || property.size || "";

  return {
    ...property,
    plotArea: property.plotArea ?? "",
    usableArea,
    builtUpArea: property.builtUpArea ?? "",
    size: property.size || usableArea,
    gallery: property.gallery.join("\n"),
    mapUrl: property.mapUrl ?? "",
    videoUrl: property.videoUrl ?? "",
    features: uniqueItems(property.features ?? []).join("\n")
  };
}

function formToProperty(form) {
  const image = form.image.trim() || sampleImage;
  const plotArea = normalizeAreaValue(form.plotArea);
  const usableArea = normalizeAreaValue(form.usableArea);
  const builtUpArea = normalizeAreaValue(form.builtUpArea);
  const size = usableArea || plotArea || builtUpArea || form.size.trim();

  return {
    id: slugify(form.id) || slugify(form.title) || `nemovitost-${Date.now()}`,
    title: form.title.trim(),
    type: form.type,
    price: form.price.trim(),
    location: form.location.trim(),
    size,
    plotArea,
    usableArea,
    builtUpArea,
    layout: form.layout.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    image,
    gallery: splitLines(form.gallery).length ? splitLines(form.gallery) : [image],
    matterportUrl: form.matterportUrl.trim(),
    videoUrl: normalizeVideoInput(form.videoUrl),
    mapUrl: normalizeMapInput(form.mapUrl),
    features: uniqueItems(splitLines(form.features)),
    createdAt: form.createdAt || new Date().toISOString()
  };
}

function readStoredProperties() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getFriendlyErrorMessage(error) {
  const message = error?.message ?? String(error);

  if (message === "Load failed" || message === "Failed to fetch") {
    return "Nepodařilo se připojit k Supabase. Zkontrolujte URL a anon key v .env.local a po změně restartujte server.";
  }

  return message;
}

function isMissingMapColumn(error) {
  return error?.message?.includes("map_url");
}

function isMissingVideoColumn(error) {
  return error?.message?.includes("video_url");
}

function isMissingAreaColumn(error) {
  return (
    error?.message?.includes("plot_area") ||
    error?.message?.includes("usable_area") ||
    error?.message?.includes("built_up_area")
  );
}

async function uploadFileToStorage(file) {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return readFileAsDataUrl(file);
  }

  const extension = file.name.split(".").pop() || "jpg";
  const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const uniqueId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const path = `properties/${uniqueId}-${safeName}.${extension}`;
  const bucket = getStorageBucketName();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function Field({ label, children, required = false, asDiv = false }) {
  const Wrapper = asDiv ? "div" : "label";

  return (
    <Wrapper className="block">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-brand-700"> *</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
    </Wrapper>
  );
}

const inputClass =
  "focus-ring w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-ink shadow-sm transition placeholder:text-zinc-400";

function AreaInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        className={`${inputClass} pr-12`}
        list="area-options"
        value={getAreaInputValue(value)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-zinc-500">
        m²
      </span>
    </div>
  );
}

const textareaClass =
  "focus-ring min-h-28 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-ink shadow-sm transition placeholder:text-zinc-400";

export default function AdminPropertyForm() {
  const [form, setForm] = useState(emptyForm);
  const [savedProperties, setSavedProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewProperty = useMemo(() => formToProperty(form), [form]);
  const selectedFeatures = useMemo(() => splitLines(form.features), [form.features]);
  const exportJson = useMemo(
    () => JSON.stringify(savedProperties, null, 2),
    [savedProperties]
  );

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setSavedProperties(readStoredProperties());
      return undefined;
    }

    async function loadAdminState() {
      setIsLoading(true);

      try {
        const [{ data: sessionData }, propertiesResponse] = await Promise.all([
          supabase.auth.getSession(),
          supabase
            .from("properties")
            .select(adminSelect)
            .order("created_at", { ascending: false })
        ]);
        let { data, error } = propertiesResponse;

        if (isMissingVideoColumn(error)) {
          const fallbackResponse = await supabase
            .from("properties")
            .select(adminSelectWithoutVideo)
            .order("created_at", { ascending: false });

          data = fallbackResponse.data;
          error = fallbackResponse.error;
        }

        if (isMissingMapColumn(error) || isMissingAreaColumn(error)) {
          const fallbackResponse = await supabase
            .from("properties")
            .select(adminSelectBase)
            .order("created_at", { ascending: false });

          data = fallbackResponse.data;
          error = fallbackResponse.error;
        }

        setSession(sessionData.session);

        if (error) {
          setSavedProperties(readStoredProperties());
          setMessage(
            "Supabase data se nepodařilo načíst. Dočasně zobrazuji lokální položky."
          );
        } else {
          setSavedProperties(data.map(fromSupabaseProperty));
        }
      } catch (error) {
        setSavedProperties(readStoredProperties());
        setMessage(`Supabase data se nepodařilo načíst: ${getFriendlyErrorMessage(error)}`);
      }

      setIsLoading(false);
    }

    loadAdminState();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  function updateField(field, value) {
    setCopied(false);
    setMessage("");
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleTitleChange(value) {
    setCopied(false);
    setMessage("");
    setForm((current) => ({
      ...current,
      title: value,
      id: editingId || isSlugManual ? current.id : slugify(value)
    }));
  }

  function handleSlugChange(value) {
    const nextSlug = slugify(value);
    setIsSlugManual(Boolean(nextSlug));
    updateField("id", nextSlug);
  }

  function toggleFeature(feature) {
    setCopied(false);
    setMessage("");
    setForm((current) => {
      const currentFeatures = splitLines(current.features);
      const nextFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((item) => item !== feature)
        : [...currentFeatures, feature];

      return {
        ...current,
        features: uniqueItems(nextFeatures).join("\n")
      };
    });
  }

  function persistLocal(nextProperties) {
    setSavedProperties(nextProperties);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProperties));
  }

  async function handleLogin(event) {
    event.preventDefault();

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Nejdřív doplňte Supabase údaje do .env.local.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });

      if (error) {
        setMessage(`Přihlášení se nepovedlo: ${error.message}`);
        return;
      }

      setAuthPassword("");
      setMessage("Správce je přihlášený.");
    } catch (error) {
      setMessage(`Přihlášení se nepovedlo: ${getFriendlyErrorMessage(error)}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setSession(null);
    setMessage("Správce je odhlášený.");
  }

  async function handleMainImageUpload(event) {
    const [file] = Array.from(event.target.files ?? []);

    if (!file) {
      return;
    }

    try {
      const imageUrl =
        supabaseEnabled && session
          ? await uploadFileToStorage(file)
          : await readFileAsDataUrl(file);
      updateField("image", imageUrl);
      setMessage(
        supabaseEnabled && session
          ? "Hlavní obrázek byl nahraný do Supabase Storage."
          : "Hlavní obrázek byl načtený lokálně do prohlížeče."
      );
    } catch {
      setMessage("Obrázek se nepodařilo načíst.");
    } finally {
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(event) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    try {
      const imageUrls = await Promise.all(
        files.map((file) =>
          supabaseEnabled && session ? uploadFileToStorage(file) : readFileAsDataUrl(file)
        )
      );
      const currentGallery = splitLines(form.gallery);
      updateField("gallery", [...currentGallery, ...imageUrls].join("\n"));
      setMessage(
        supabaseEnabled && session
          ? "Obrázky galerie byly nahrané do Supabase Storage."
          : "Obrázky galerie byly načtené lokálně do prohlížeče."
      );
    } catch {
      setMessage("Některý obrázek galerie se nepodařilo načíst.");
    } finally {
      event.target.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const property = formToProperty(form);
    const requiredFields = [
      property.title,
      property.price,
      property.location,
      property.layout,
      property.shortDescription,
      property.description
    ];

    if (requiredFields.some((field) => !field)) {
      setMessage("Vyplňte povinná pole označená hvězdičkou.");
      return;
    }

    if (!property.plotArea && !property.usableArea && !property.builtUpArea) {
      setMessage("Vyplňte alespoň jednu plochu nemovitosti.");
      return;
    }

    setIsSaving(true);

    if (supabaseEnabled) {
      const supabase = getSupabaseBrowserClient();

      if (!session) {
        setMessage("Pro uložení do Supabase se nejdřív přihlaste jako správce.");
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from("properties")
        .upsert(toSupabaseProperty(property), { onConflict: "id" });

      setIsSaving(false);

      if (error) {
        if (isMissingVideoColumn(error)) {
          setMessage(
            "Uložení se nepovedlo: v Supabase chybí sloupec video_url. Spusťte SQL soubor supabase/add-property-video-url.sql."
          );
          return;
        }

        if (isMissingAreaColumn(error)) {
          setMessage(
            "Uložení se nepovedlo: v Supabase chybí sloupce pro plochy. Spusťte SQL soubor supabase/add-property-area-fields.sql."
          );
          return;
        }

        setMessage(`Uložení do Supabase se nepovedlo: ${error.message}`);
        return;
      }

      const withoutCurrent = savedProperties.filter(
        (item) => item.id !== (editingId ?? property.id)
      );
      setSavedProperties([...withoutCurrent, property]);
      setForm(emptyForm);
      setEditingId(null);
      setIsSlugManual(false);
      setMessage(
        editingId
          ? "Nemovitost byla upravena v Supabase."
          : "Nemovitost byla uložena do Supabase."
      );
      return;
    }

    const withoutCurrent = savedProperties.filter(
      (item) => item.id !== (editingId ?? property.id)
    );
    persistLocal([...withoutCurrent, property]);
    setIsSaving(false);
    setForm(emptyForm);
    setEditingId(null);
    setIsSlugManual(false);
    setMessage(editingId ? "Nemovitost byla upravena." : "Nemovitost byla uložena.");
  }

  function handleEdit(property) {
    setForm(propertyToForm(property));
    setEditingId(property.id);
    setIsSlugManual(true);
    setMessage("");
    setCopied(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (supabaseEnabled) {
      const supabase = getSupabaseBrowserClient();

      if (!session) {
        setMessage("Pro mazání ze Supabase se nejdřív přihlaste jako správce.");
        return;
      }

      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) {
        setMessage(`Mazání se nepovedlo: ${error.message}`);
        return;
      }
    }

    persistLocal(savedProperties.filter((property) => property.id !== id));

    if (editingId === id) {
      setForm(emptyForm);
      setEditingId(null);
      setIsSlugManual(false);
    }
  }

  async function handleCopy() {
    const text = exportJson || "[]";

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setMessage("JSON je zkopírovaný do schránky.");
    } catch {
      setCopied(false);
      setMessage("Kopírování se nepovedlo. JSON můžete označit ručně níže.");
    }
  }

  function handleDownload() {
    const blob = new Blob([exportJson || "[]"], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "smar-nemovitosti.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <datalist id="area-options">
          {areaOptions.map((area) => (
            <option key={area} value={area} />
          ))}
        </datalist>

        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
              Administrace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {editingId ? "Upravit nemovitost" : "Nová nemovitost"}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setIsSlugManual(false);
              setMessage("");
            }}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Vyčistit
          </button>
        </div>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">
                {supabaseEnabled ? "Supabase režim" : "Lokální prototyp"}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                {supabaseEnabled
                  ? session
                    ? `Přihlášeno jako ${session.user.email}. Nemovitosti se ukládají do databáze.`
                    : "Supabase je nastavený. Pro ukládání a upload obrázků se přihlaste jako správce."
                  : supabaseConfigIssue
                    ? `${supabaseConfigIssue} Teď se používá localStorage a JSON export.`
                    : "Doplňte .env.local pro ukládání do Supabase. Teď se používá localStorage a JSON export."}
              </p>
            </div>

            {supabaseEnabled ? (
              session ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Odhlásit
                </button>
              ) : (
                <div className="grid gap-2 sm:grid-cols-[180px_180px_auto]">
                  <input
                    className={inputClass}
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                    placeholder="admin@email.cz"
                    type="email"
                  />
                  <input
                    className={inputClass}
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                    placeholder="Heslo"
                    type="password"
                  />
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isSaving}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    Přihlásit
                  </button>
                </div>
              )
            ) : null}
          </div>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Název" required>
            <input
              className={inputClass}
              value={form.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Byt 3+kk s balkonem"
            />
          </Field>

          <Field label="ID / URL slug">
            <input
              className={inputClass}
              value={form.id}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="byt-3kk-s-balkonem"
            />
          </Field>

          <Field label="Typ nabídky" required>
            <select
              className={inputClass}
              value={form.type}
              onChange={(event) => updateField("type", event.target.value)}
            >
              <option value="prodej">Prodej</option>
              <option value="pronajem">Pronájem</option>
            </select>
          </Field>

          <Field label="Cena" required>
            <input
              className={inputClass}
              value={form.price}
              onChange={(event) => updateField("price", event.target.value)}
              placeholder="9 900 000 Kč"
            />
          </Field>

          <Field label="Lokalita" required>
            <input
              className={inputClass}
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Praha 5 - Smíchov"
            />
          </Field>

          <Field label="Mapa / adresa">
            <textarea
              className="focus-ring min-h-24 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-ink shadow-sm transition placeholder:text-zinc-400"
              value={form.mapUrl}
              onChange={(event) => updateField("mapUrl", event.target.value)}
              placeholder={
                "Nejlepší je iframe z Mapy.com: <iframe src=\"https://frame.mapy.cz/s/...\">\nnebo sdílený odkaz https://mapy.com/s/...\nnebo přesná adresa jako odkaz"
              }
            />
          </Field>

          <Field label="Plocha pozemku">
            <AreaInput
              value={form.plotArea}
              onChange={(value) => updateField("plotArea", value)}
              placeholder="např. 620"
            />
          </Field>

          <Field label="Užitná plocha">
            <AreaInput
              value={form.usableArea}
              onChange={(value) => updateField("usableArea", value)}
              placeholder="např. 86"
            />
          </Field>

          <Field label="Zastavěná plocha">
            <AreaInput
              value={form.builtUpArea}
              onChange={(value) => updateField("builtUpArea", value)}
              placeholder="např. 124"
            />
          </Field>

          <Field label="Dispozice / typ" required>
            <select
              className={inputClass}
              value={form.layout}
              onChange={(event) => updateField("layout", event.target.value)}
            >
              {layoutOptions.map((layout) => (
                <option key={layout} value={layout}>
                  {layout}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Hlavní obrázek" asDiv>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                <input
                  className={inputClass}
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="https://images.unsplash.com/... nebo data:image/..."
                />
                <label className="focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100">
                  <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  Nahrát z PC
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </Field>
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          <Field label="Krátký popis" required>
            <textarea
              className={textareaClass}
              value={form.shortDescription}
              onChange={(event) =>
                updateField("shortDescription", event.target.value)
              }
              placeholder="Krátký text pro kartu nemovitosti."
            />
          </Field>

          <Field label="Dlouhý popis" required>
            <textarea
              className="focus-ring min-h-36 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-ink shadow-sm transition placeholder:text-zinc-400"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Detailní popis nemovitosti pro stránku detailu."
            />
          </Field>

          <Field label="Galerie obrázků" asDiv>
            <div className="space-y-3">
              <textarea
                className={textareaClass}
                value={form.gallery}
                onChange={(event) => updateField("gallery", event.target.value)}
                placeholder={
                  "https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                }
              />
              <label className="focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600 inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100">
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                Nahrát obrázky z PC
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </Field>

          <Field label="Matterport URL">
            <input
              className={inputClass}
              value={form.matterportUrl}
              onChange={(event) =>
                updateField("matterportUrl", event.target.value)
              }
              placeholder="https://my.matterport.com/show/?m=..."
            />
          </Field>

          <Field label="Video URL">
            <input
              className={inputClass}
              value={form.videoUrl}
              onChange={(event) => updateField("videoUrl", event.target.value)}
              placeholder="YouTube, Vimeo, přímé MP4/WebM video nebo iframe src"
            />
          </Field>

          <Field label="Hlavní vlastnosti" asDiv>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {featureOptions.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature);

                  return (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={`focus-ring inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "border-brand-700 bg-brand-700 text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : null}
                      {feature}
                    </button>
                  );
                })}
              </div>
              <textarea
                className={textareaClass}
                value={form.features}
                onChange={(event) => updateField("features", event.target.value)}
                placeholder={"Vlastní vlastnost na každý řádek\nNapř. krbová kamna"}
              />
            </div>
          </Field>
        </div>

        {message ? (
          <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900">
            {message}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSaving}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-900"
          >
            {editingId ? (
              <Save className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4" aria-hidden="true" />
            )}
            {isSaving
              ? "Ukládám..."
              : editingId
                ? "Uložit změny"
                : "Přidat nemovitost"}
          </button>
          <button
            type="button"
            onClick={() => {
              updateField("image", sampleImage);
              updateField(
                "gallery",
                [
                  sampleImage,
                  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
                  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                ].join("\n")
              );
            }}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Doplnit ukázkové fotky
          </button>
        </div>
      </form>

      <aside className="space-y-6">
        <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="relative aspect-[4/3] bg-zinc-200">
            <img
              src={previewProperty.image}
              alt={previewProperty.title || "Náhled nemovitosti"}
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {propertyTypeLabels[previewProperty.type]}
            </span>
            {previewProperty.videoUrl ? (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink shadow-sm">
                <PlayCircle className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
                Video
              </span>
            ) : null}
          </div>
          <div className="p-5">
            <p className="text-sm text-zinc-500">
              {previewProperty.location || "Lokalita"}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-ink">
              {previewProperty.title || "Název nemovitosti"}
            </h2>
            <p className="mt-3 text-lg font-semibold text-brand-900">
              {previewProperty.price || "Cena"}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              {previewProperty.shortDescription ||
                "Krátký popis se zobrazí v kartě nemovitosti."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-zinc-600">
              {getAreaItems(previewProperty).map((area) => (
                <span key={area.key} className="rounded-full bg-zinc-100 px-3 py-1">
                  {area.shortLabel}: {area.value}
                </span>
              ))}
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                {previewProperty.layout || "Dispozice"}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink">Uložené položky</h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-700">
              {isLoading ? "..." : savedProperties.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {savedProperties.length ? (
              savedProperties.map((property) => (
                <div
                  key={property.id}
                  className="rounded-lg border border-zinc-200 p-3"
                >
                  <p className="font-semibold text-ink">{property.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {property.location} · {property.price}
                  </p>
                  {property.createdAt ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      Vloženo {formatPropertyDate(property.createdAt)}
                    </p>
                  ) : null}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(property)}
                      className="focus-ring inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Upravit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(property.id)}
                      className="focus-ring inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Smazat
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm leading-6 text-zinc-600">
                Zatím tu není uložená žádná nová nemovitost.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-ink">Export JSON</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                Kopírovat
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Stáhnout
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={exportJson || "[]"}
            className="mt-4 h-56 w-full rounded-lg border border-zinc-200 bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-100"
          />
        </section>
      </aside>
    </div>
  );
}
