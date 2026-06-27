"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
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
const AUTH_TIMEOUT_MS = 15000;
const SAVE_TIMEOUT_MS = 30000;
const supabaseConfigIssue = getSupabaseConfigIssue();
const supabaseEnabled = hasSupabaseConfig();
const adminSelect =
  "id,title,type,price,location,size,plot_area,usable_area,built_up_area,layout,short_description,description,image,gallery,floor_plan,matterport_url,video_url,map_url,features,published,created_at";
const adminSelectWithoutVideo =
  "id,title,type,price,location,size,plot_area,usable_area,built_up_area,layout,short_description,description,image,gallery,floor_plan,matterport_url,map_url,features,published,created_at";
const adminSelectWithoutFloorPlan =
  "id,title,type,price,location,size,plot_area,usable_area,built_up_area,layout,short_description,description,image,gallery,matterport_url,map_url,features,published,created_at";
const adminSelectWithoutVideoAndFloorPlan =
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
  floorPlan: "",
  matterportUrl: "",
  videoUrl: "",
  mapUrl: "",
  features: "",
  createdAt: ""
};

const emptyUploadMessages = {
  image: "",
  gallery: "",
  floorPlan: "",
  video: ""
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
    floorPlan: property.floorPlan ?? "",
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
    floorPlan: form.floorPlan.trim(),
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

function clearSupabaseAuthStorage() {
  const storages = [window.localStorage, window.sessionStorage].filter(Boolean);

  storages.forEach((storage) => {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index);

      if (
        key === "supabase.auth.token" ||
        (key?.startsWith("sb-") && key.includes("auth-token"))
      ) {
        storage.removeItem(key);
      }
    }
  });
}

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    window.clearTimeout(timeoutId);
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

function isMissingFloorPlanColumn(error) {
  return error?.message?.includes("floor_plan");
}

function isMissingAreaColumn(error) {
  return (
    error?.message?.includes("plot_area") ||
    error?.message?.includes("usable_area") ||
    error?.message?.includes("built_up_area")
  );
}

function isRlsError(error) {
  const message = error?.message?.toLowerCase() ?? "";

  return (
    error?.code === "42501" ||
    message.includes("row-level security") ||
    message.includes("permission denied")
  );
}

function getAdminErrorMessage(error) {
  if (isRlsError(error)) {
    return "Supabase RLS nepovolilo akci. Zkontrolujte, že přihlášený účet je vložený v tabulce public.admin_users.";
  }

  return getFriendlyErrorMessage(error);
}

function getAuthErrorMessage(error) {
  const message = error?.message ?? String(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "Přihlášení se nepovedlo: zkontrolujte e-mail a heslo.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Přihlášení se nepovedlo: e-mail účtu není potvrzený v Supabase.";
  }

  return `Přihlášení se nepovedlo: ${getFriendlyErrorMessage(error)}`;
}

async function fetchAdminProperties(supabase) {
  let { data, error } = await supabase
    .from("properties")
    .select(adminSelect)
    .order("created_at", { ascending: false });

  if (isMissingFloorPlanColumn(error)) {
    const fallbackResponse = await supabase
      .from("properties")
      .select(adminSelectWithoutFloorPlan)
      .order("created_at", { ascending: false });

    data = fallbackResponse.data;
    error = fallbackResponse.error;
  }

  if (isMissingVideoColumn(error)) {
    const fallbackResponse = await supabase
      .from("properties")
      .select(adminSelectWithoutVideo)
      .order("created_at", { ascending: false });

    data = fallbackResponse.data;
    error = fallbackResponse.error;
  }

  if (isMissingFloorPlanColumn(error)) {
    const fallbackResponse = await supabase
      .from("properties")
      .select(adminSelectWithoutVideoAndFloorPlan)
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

  if (error) {
    return { properties: [], error };
  }

  return { properties: data.map(fromSupabaseProperty), error: null };
}

async function checkAdminMembership(supabase, currentSession) {
  const userId = currentSession?.user?.id;
  const userEmail = currentSession?.user?.email;

  if (!userId) {
    return "";
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return `Nepodařilo se ověřit správcovské oprávnění: ${getFriendlyErrorMessage(error)}`;
  }

  if (!data) {
    return `Účet ${userEmail || "bez e-mailu"} není v tabulce public.admin_users. Přidávání a editace může být blokovaná RLS pravidly.`;
  }

  return "";
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

function FileUploadButton({
  accept,
  icon: Icon,
  label,
  multiple = false,
  onChange
}) {
  return (
    <span className="focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600 relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        aria-label={label}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </span>
  );
}

function UploadStatus({ message }) {
  if (!message) {
    return null;
  }

  const isError =
    message.toLowerCase().includes("nepodařilo") ||
    message.toLowerCase().includes("musí");

  return (
    <p
      className={`text-sm font-medium ${
        isError ? "text-red-700" : "text-brand-800"
      }`}
    >
      {message}
    </p>
  );
}

export default function AdminPropertyForm() {
  const [form, setForm] = useState(emptyForm);
  const [uploadMessages, setUploadMessages] = useState(emptyUploadMessages);
  const [savedProperties, setSavedProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [message, setMessage] = useState("");
  const [adminAccessWarning, setAdminAccessWarning] = useState("");
  const [session, setSession] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const authFlowIdRef = useRef(0);
  const isAuthBusyRef = useRef(false);

  const previewProperty = useMemo(() => formToProperty(form), [form]);
  const selectedFeatures = useMemo(() => splitLines(form.features), [form.features]);
  function setAuthBusy(value) {
    isAuthBusyRef.current = value;
    setIsAuthBusy(value);
  }

  async function refreshAdminAccess(currentSession, flowId = authFlowIdRef.current) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase || !currentSession) {
      setAdminAccessWarning("");
      return;
    }

    const warning = await checkAdminMembership(supabase, currentSession);

    if (flowId !== authFlowIdRef.current) {
      return;
    }

    setAdminAccessWarning(warning);
  }

  async function refreshAdminProperties({
    fallbackToLocal = true,
    flowId = authFlowIdRef.current
  } = {}) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setSavedProperties(readStoredProperties());
      return false;
    }

    setIsLoading(true);

    try {
      const { properties, error } = await fetchAdminProperties(supabase);

      if (flowId !== authFlowIdRef.current) {
        return false;
      }

      if (error) {
        setSavedProperties(fallbackToLocal ? readStoredProperties() : []);
        setMessage(
          `Supabase data se nepodařilo načíst: ${getAdminErrorMessage(error)}`
        );
        return false;
      }

      setSavedProperties(properties);
      return true;
    } catch (error) {
      if (flowId !== authFlowIdRef.current) {
        return false;
      }

      setSavedProperties(fallbackToLocal ? readStoredProperties() : []);
      setMessage(`Supabase data se nepodařilo načíst: ${getAdminErrorMessage(error)}`);
      return false;
    } finally {
      if (flowId === authFlowIdRef.current) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setSavedProperties(readStoredProperties());
      return undefined;
    }

    async function loadAdminState() {
      const flowId = authFlowIdRef.current;

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        if (!sessionData.session) {
          setSavedProperties([]);
          setAdminAccessWarning("");
          return;
        }

        await refreshAdminAccess(sessionData.session, flowId);
        await refreshAdminProperties({ fallbackToLocal: false, flowId });
      } catch (error) {
        setSavedProperties([]);
        setMessage(`Supabase data se nepodařilo načíst: ${getAdminErrorMessage(error)}`);
      }
    }

    loadAdminState();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (isAuthBusyRef.current) {
          return;
        }

        const flowId = authFlowIdRef.current;
        setSession(nextSession);

        if (!nextSession) {
          setSavedProperties([]);
          setAdminAccessWarning("");
          return;
        }

        await refreshAdminAccess(nextSession, flowId);
        await refreshAdminProperties({ fallbackToLocal: false, flowId });
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  function updateField(field, value) {
    setMessage("");
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function updateUploadMessage(field, value) {
    setUploadMessages((current) => ({
      ...current,
      [field]: value
    }));
  }

  function resetUploadMessages() {
    setUploadMessages(emptyUploadMessages);
  }

  function handleTitleChange(value) {
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

  function handleLoginKeyDown(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    handleLogin(event);
  }

  async function handleLogin(event) {
    event?.preventDefault();

    if (isAuthBusy) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Nejdřív doplňte Supabase údaje do .env.local.");
      return;
    }

    const flowId = authFlowIdRef.current + 1;
    authFlowIdRef.current = flowId;
    setAuthBusy(true);
    setMessage("");
    setAdminAccessWarning("");
    setSavedProperties([]);

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword
        }),
        AUTH_TIMEOUT_MS,
        "Přihlášení trvá příliš dlouho. Zkontrolujte připojení k Supabase a zkuste to znovu."
      );

      if (error) {
        if (flowId === authFlowIdRef.current) {
          setMessage(getAuthErrorMessage(error));
        }
        return;
      }

      if (flowId !== authFlowIdRef.current) {
        return;
      }

      if (data.session) {
        setSession(data.session);
        await refreshAdminAccess(data.session, flowId);
        const propertiesLoaded = await refreshAdminProperties({
          fallbackToLocal: false,
          flowId
        });

        if (!propertiesLoaded) {
          setAuthPassword("");
          return;
        }
      }

      setAuthPassword("");
      setMessage("Správce je přihlášený a data byla znovu načtena.");
    } catch (error) {
      if (flowId === authFlowIdRef.current) {
        setMessage(getAuthErrorMessage(error));
      }
    } finally {
      if (flowId === authFlowIdRef.current) {
        setAuthBusy(false);
      }
    }
  }

  async function handleSignOut() {
    if (isAuthBusy) {
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    const flowId = authFlowIdRef.current + 1;
    authFlowIdRef.current = flowId;
    setAuthBusy(true);
    setMessage("Odhlašuji správce...");
    let signOutWarning = "";

    try {
      const { error } = await withTimeout(
        supabase.auth.signOut({ scope: "local" }),
        AUTH_TIMEOUT_MS,
        "Odhlášení na Supabase trvá příliš dlouho."
      );

      if (flowId !== authFlowIdRef.current) {
        return;
      }

      if (error) {
        signOutWarning = getFriendlyErrorMessage(error);
      }
    } catch (error) {
      if (flowId === authFlowIdRef.current) {
        signOutWarning = getFriendlyErrorMessage(error);
      }
    } finally {
      if (flowId === authFlowIdRef.current) {
        clearSupabaseAuthStorage();
        setSession(null);
        setAdminAccessWarning("");
        setSavedProperties([]);
        setForm(emptyForm);
        resetUploadMessages();
        setEditingId(null);
        setIsSlugManual(false);
        setAuthPassword("");
        setMessage(
          signOutWarning
            ? `Správce je odhlášený. Lokální relace byla vyčištěna, ale Supabase neodpovědělo včas: ${signOutWarning}`
            : "Správce je odhlášený."
        );
        setAuthBusy(false);
      }
    }
  }

  async function handleMainImageUpload(event) {
    const [file] = Array.from(event.target.files ?? []);

    if (!file) {
      return;
    }

    updateUploadMessage("image", "Nahrávám hlavní obrázek...");

    try {
      const imageUrl =
        supabaseEnabled && session
          ? await uploadFileToStorage(file)
          : await readFileAsDataUrl(file);
      updateField("image", imageUrl);
      const successMessage =
        supabaseEnabled && session
          ? "Hlavní obrázek byl nahraný do Supabase Storage."
          : "Hlavní obrázek byl načtený lokálně do prohlížeče.";
      updateUploadMessage("image", successMessage);
      setMessage(successMessage);
    } catch (error) {
      const errorMessage = `Obrázek se nepodařilo načíst: ${getAdminErrorMessage(error)}`;
      updateUploadMessage("image", errorMessage);
      setMessage(errorMessage);
    } finally {
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(event) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    updateUploadMessage("gallery", "Nahrávám obrázky galerie...");

    try {
      const imageUrls = await Promise.all(
        files.map((file) =>
          supabaseEnabled && session ? uploadFileToStorage(file) : readFileAsDataUrl(file)
        )
      );
      const currentGallery = splitLines(form.gallery);
      updateField("gallery", [...currentGallery, ...imageUrls].join("\n"));
      const successMessage =
        supabaseEnabled && session
          ? "Obrázky galerie byly nahrané do Supabase Storage."
          : "Obrázky galerie byly načtené lokálně do prohlížeče.";
      updateUploadMessage("gallery", successMessage);
      setMessage(successMessage);
    } catch (error) {
      const errorMessage = `Některý obrázek galerie se nepodařilo načíst: ${getAdminErrorMessage(error)}`;
      updateUploadMessage("gallery", errorMessage);
      setMessage(errorMessage);
    } finally {
      event.target.value = "";
    }
  }

  async function handleFloorPlanUpload(event) {
    const [file] = Array.from(event.target.files ?? []);

    if (!file) {
      return;
    }

    if (file.type !== "image/png") {
      const errorMessage = "Půdorys musí být ve formátu PNG.";
      updateUploadMessage("floorPlan", errorMessage);
      setMessage(errorMessage);
      event.target.value = "";
      return;
    }

    updateUploadMessage("floorPlan", "Nahrávám půdorys...");

    try {
      const floorPlanUrl =
        supabaseEnabled && session
          ? await uploadFileToStorage(file)
          : await readFileAsDataUrl(file);
      updateField("floorPlan", floorPlanUrl);
      const successMessage =
        supabaseEnabled && session
          ? "Půdorys byl nahraný do Supabase Storage."
          : "Půdorys byl načtený lokálně do prohlížeče.";
      updateUploadMessage("floorPlan", successMessage);
      setMessage(successMessage);
    } catch (error) {
      const errorMessage = `Půdorys se nepodařilo načíst: ${getAdminErrorMessage(error)}`;
      updateUploadMessage("floorPlan", errorMessage);
      setMessage(errorMessage);
    } finally {
      event.target.value = "";
    }
  }

  async function handleVideoUpload(event) {
    const [file] = Array.from(event.target.files ?? []);

    if (!file) {
      return;
    }

    updateUploadMessage("video", "Nahrávám video...");

    try {
      const videoUrl =
        supabaseEnabled && session
          ? await uploadFileToStorage(file)
          : await readFileAsDataUrl(file);
      updateField("videoUrl", videoUrl);
      const successMessage =
        supabaseEnabled && session
          ? "Video bylo nahrané do Supabase Storage."
          : "Video bylo načtené lokálně do prohlížeče.";
      updateUploadMessage("video", successMessage);
      setMessage(successMessage);
    } catch (error) {
      const errorMessage = `Video se nepodařilo načíst: ${getAdminErrorMessage(error)}`;
      updateUploadMessage("video", errorMessage);
      setMessage(errorMessage);
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

    try {
      if (supabaseEnabled) {
        const supabase = getSupabaseBrowserClient();

        if (!session) {
          setMessage("Pro uložení do Supabase se nejdřív přihlaste jako správce.");
          return;
        }

        const { error } = await withTimeout(
          supabase
            .from("properties")
            .upsert(toSupabaseProperty(property), { onConflict: "id" }),
          SAVE_TIMEOUT_MS,
          "Uložení trvá příliš dlouho. Zkontrolujte připojení k Supabase a zkuste to znovu."
        );

        if (error) {
          if (isMissingVideoColumn(error)) {
            setMessage(
              "Uložení se nepovedlo: v Supabase chybí sloupec video_url. Spusťte SQL soubor supabase/add-property-video-url.sql."
            );
            return;
          }

          if (isMissingFloorPlanColumn(error)) {
            setMessage(
              "Uložení se nepovedlo: v Supabase chybí sloupec floor_plan. Spusťte SQL soubor supabase/add-property-floor-plan.sql."
            );
            return;
          }

          if (isMissingAreaColumn(error)) {
            setMessage(
              "Uložení se nepovedlo: v Supabase chybí sloupce pro plochy. Spusťte SQL soubor supabase/add-property-area-fields.sql."
            );
            return;
          }

          setMessage(`Uložení do Supabase se nepovedlo: ${getAdminErrorMessage(error)}`);
          return;
        }

        const withoutCurrent = savedProperties.filter(
          (item) => item.id !== (editingId ?? property.id)
        );
        setSavedProperties([...withoutCurrent, property]);
        setIsSaving(false);
        await refreshAdminProperties({ fallbackToLocal: false });
        setForm(emptyForm);
        resetUploadMessages();
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
      setForm(emptyForm);
      resetUploadMessages();
      setEditingId(null);
      setIsSlugManual(false);
      setMessage(editingId ? "Nemovitost byla upravena." : "Nemovitost byla uložena.");
    } catch (error) {
      setMessage(`Uložení se nepovedlo: ${getAdminErrorMessage(error)}`);
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(property) {
    setForm(propertyToForm(property));
    resetUploadMessages();
    setEditingId(property.id);
    setIsSlugManual(true);
    setMessage("");
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
        setMessage(`Mazání se nepovedlo: ${getAdminErrorMessage(error)}`);
        return;
      }

      await refreshAdminProperties({ fallbackToLocal: false });

      if (editingId === id) {
        setForm(emptyForm);
        resetUploadMessages();
        setEditingId(null);
        setIsSlugManual(false);
      }

      return;
    }

    persistLocal(savedProperties.filter((property) => property.id !== id));

    if (editingId === id) {
      setForm(emptyForm);
      resetUploadMessages();
      setEditingId(null);
      setIsSlugManual(false);
    }
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
              resetUploadMessages();
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
              {adminAccessWarning ? (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
                  {adminAccessWarning}
                </p>
              ) : null}
            </div>

            {supabaseEnabled ? (
              session ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isAuthBusy}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {isAuthBusy ? "Odhlašuji..." : "Odhlásit"}
                </button>
              ) : (
                <div className="grid gap-2 sm:grid-cols-[180px_180px_auto]">
                  <input
                    className={inputClass}
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                    onKeyDown={handleLoginKeyDown}
                    placeholder="admin@email.cz"
                    type="email"
                    disabled={isAuthBusy}
                  />
                  <input
                    className={inputClass}
                    value={authPassword}
                    onChange={(event) => setAuthPassword(event.target.value)}
                    onKeyDown={handleLoginKeyDown}
                    placeholder="Heslo"
                    type="password"
                    disabled={isAuthBusy}
                  />
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={isAuthBusy}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    {isAuthBusy ? "Přihlašuji..." : "Přihlásit"}
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
                <FileUploadButton
                  accept="image/*"
                  icon={ImagePlus}
                  label="Nahrát z PC"
                  onChange={handleMainImageUpload}
                />
              </div>
              <UploadStatus message={uploadMessages.image} />
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
              <FileUploadButton
                accept="image/*"
                icon={ImagePlus}
                label="Nahrát obrázky z PC"
                multiple
                onChange={handleGalleryUpload}
              />
              <UploadStatus message={uploadMessages.gallery} />
            </div>
          </Field>

          <Field label="Půdorys (PNG)" asDiv>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
                <input
                  className={inputClass}
                  value={form.floorPlan}
                  onChange={(event) => updateField("floorPlan", event.target.value)}
                  placeholder="URL se doplní po nahrání PNG z PC"
                />
                <FileUploadButton
                  accept="image/png"
                  icon={ImagePlus}
                  label="Nahrát PNG"
                  onChange={handleFloorPlanUpload}
                />
                <button
                  type="button"
                  onClick={() => updateField("floorPlan", "")}
                  disabled={!form.floorPlan}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Odebrat
                </button>
              </div>
              {form.floorPlan ? (
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                  <img
                    src={form.floorPlan}
                    alt="Náhled půdorysu"
                    className="max-h-80 w-full object-contain"
                  />
                </div>
              ) : null}
              <UploadStatus message={uploadMessages.floorPlan} />
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

          <Field label="Video URL" asDiv>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <input
                className={inputClass}
                value={form.videoUrl}
                onChange={(event) => updateField("videoUrl", event.target.value)}
                placeholder="YouTube, Vimeo, přímé MP4/WebM video nebo iframe src"
              />
              <FileUploadButton
                accept="video/*"
                icon={PlayCircle}
                label="Nahrát video z PC"
                onChange={handleVideoUpload}
              />
            </div>
            <UploadStatus message={uploadMessages.video} />
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
      </aside>
    </div>
  );
}
