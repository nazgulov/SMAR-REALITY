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
  Plus,
  RefreshCw,
  Save,
  Trash2
} from "lucide-react";
import { propertyTypeLabels } from "@/data/properties";
import {
  getStorageBucketName,
  getSupabaseBrowserClient,
  hasSupabaseConfig
} from "@/lib/supabase/client";
import {
  fromSupabaseProperty,
  toSupabaseProperty
} from "@/lib/property-mappers";

const STORAGE_KEY = "smar-admin-properties";
const supabaseEnabled = hasSupabaseConfig();
const adminSelect =
  "id,title,type,price,location,size,layout,short_description,description,image,gallery,matterport_url,features,published,created_at";

const emptyForm = {
  id: "",
  title: "",
  type: "prodej",
  price: "",
  location: "",
  size: "50 m²",
  layout: "1+kk, byt",
  shortDescription: "",
  description: "",
  image: "",
  gallery: "",
  matterportUrl: "",
  features: ""
};

const sampleImage =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

const sizeOptions = [
  "25 m²",
  "30 m²",
  "35 m²",
  "40 m²",
  "45 m²",
  "50 m²",
  "55 m²",
  "58 m²",
  "60 m²",
  "64 m²",
  "65 m²",
  "70 m²",
  "75 m²",
  "80 m²",
  "86 m²",
  "90 m²",
  "100 m²",
  "112 m²",
  "120 m²",
  "124 m²",
  "150 m²",
  "180 m²",
  "182 m²",
  "200 m²"
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

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function splitLines(value) {
  return value
    .split(/\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function propertyToForm(property) {
  return {
    ...property,
    gallery: property.gallery.join("\n"),
    features: property.features.join("\n")
  };
}

function formToProperty(form) {
  const image = form.image.trim() || sampleImage;

  return {
    id: form.id.trim() || slugify(form.title) || `nemovitost-${Date.now()}`,
    title: form.title.trim(),
    type: form.type,
    price: form.price.trim(),
    location: form.location.trim(),
    size: form.size.trim(),
    layout: form.layout.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    image,
    gallery: splitLines(form.gallery).length ? splitLines(form.gallery) : [image],
    matterportUrl: form.matterportUrl.trim(),
    features: splitLines(form.features)
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

function Field({ label, children, required = false }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-brand-700"> *</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass =
  "focus-ring w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-ink shadow-sm transition placeholder:text-zinc-400";

const textareaClass =
  "focus-ring min-h-28 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-ink shadow-sm transition placeholder:text-zinc-400";

export default function AdminPropertyForm() {
  const [form, setForm] = useState(emptyForm);
  const [savedProperties, setSavedProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewProperty = useMemo(() => formToProperty(form), [form]);
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

      const [{ data: sessionData }, { data, error }] = await Promise.all([
        supabase.auth.getSession(),
        supabase
          .from("properties")
          .select(adminSelect)
          .order("created_at", { ascending: false })
      ]);

      setSession(sessionData.session);

      if (error) {
        setSavedProperties(readStoredProperties());
        setMessage(
          "Supabase data se nepodařilo načíst. Dočasně zobrazuji lokální položky."
        );
      } else {
        setSavedProperties(data.map(fromSupabaseProperty));
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

  useEffect(() => {
    if (!form.title || editingId) {
      return;
    }

    setForm((current) => ({
      ...current,
      id: current.id || slugify(current.title)
    }));
  }, [form.title, editingId]);

  function updateField(field, value) {
    setCopied(false);
    setMessage("");
    setForm((current) => ({
      ...current,
      [field]: value
    }));
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
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    });
    setIsSaving(false);

    if (error) {
      setMessage(`Přihlášení se nepovedlo: ${error.message}`);
      return;
    }

    setAuthPassword("");
    setMessage("Správce je přihlášený.");
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
      property.size,
      property.layout,
      property.shortDescription,
      property.description
    ];

    if (requiredFields.some((field) => !field)) {
      setMessage("Vyplňte povinná pole označená hvězdičkou.");
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
        setMessage(`Uložení do Supabase se nepovedlo: ${error.message}`);
        return;
      }

      const withoutCurrent = savedProperties.filter(
        (item) => item.id !== (editingId ?? property.id)
      );
      setSavedProperties([...withoutCurrent, property]);
      setForm(emptyForm);
      setEditingId(null);
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
    setMessage(editingId ? "Nemovitost byla upravena." : "Nemovitost byla uložena.");
  }

  function handleEdit(property) {
    setForm(propertyToForm(property));
    setEditingId(property.id);
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
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Byt 3+kk s balkonem"
            />
          </Field>

          <Field label="ID / URL slug">
            <input
              className={inputClass}
              value={form.id}
              onChange={(event) => updateField("id", slugify(event.target.value))}
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

          <Field label="Velikost" required>
            <select
              className={inputClass}
              value={form.size}
              onChange={(event) => updateField("size", event.target.value)}
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
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
            <Field label="Hlavní obrázek">
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

          <Field label="Galerie obrázků">
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

          <Field label="Hlavní vlastnosti">
            <textarea
              className={textareaClass}
              value={form.features}
              onChange={(event) => updateField("features", event.target.value)}
              placeholder={"Balkon\nSklep\nParkování"}
            />
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
              <span className="rounded-full bg-zinc-100 px-3 py-1">
                {previewProperty.size || "Velikost"}
              </span>
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
