# SMAR Reality Wireframe

Moderní wireframe realitního webu pro firmu **SMAR s.r.o.**. Projekt používá Next.js App Router, React, Tailwind CSS a lokální mock data s připraveným napojením na Supabase.

## Co je hotové

- úvodní stránka s hero sekcí a přehledem nemovitostí
- rozdělení nabídek na prodej a pronájem
- detail každé nemovitosti na trase `/nemovitosti/[id]`
- Matterport iframe blok s placeholderem pro budoucí URL
- mapa lokality přes Mapy.com na detailu nemovitosti
- administrační prototyp `/admin/nemovitosti` pro vložení a export nemovitostí
- informační stránka `/sprava-nemovitosti`
- responzivní layout pro desktop, tablet i mobil
- data v souboru `data/properties.js`
- volitelné načítání a ukládání nemovitostí přes Supabase

## Spuštění projektu

```bash
npm install
npm run dev
```

Web poběží na:

```bash
http://localhost:3000
```

Produkční build:

```bash
npm run build
npm run start
```

## Supabase databáze

Projekt umí běžet bez Supabase a použije lokální `data/properties.js`. Jakmile
doplníte `.env.local`, web začne číst nemovitosti ze Supabase a administrace
začne ukládat do databáze.

1. V Supabase vytvořte nový projekt.
2. V SQL editoru spusťte obsah souboru `supabase/schema.sql`.
3. V Authentication vytvořte admin uživatele přes email a heslo.
4. Zkopírujte `.env.example` do `.env.local` a doplňte hodnoty:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=property-images
```

5. Restartujte lokální server:

```bash
npm run dev
```

Administrace je na `/admin/nemovitosti`. Bez přihlášení umí lokální prototyp a
export JSON. Po přihlášení admin účtem ukládá nemovitosti do Supabase a nahrává
obrázky do Storage bucketu `property-images`.

Pozor: GitHub Pages je statický hosting. Pro skutečně dynamické načítání nových
nemovitostí bez rebuild/deploy doporučujeme nasadit projekt na Vercel.

## Publikace na GitHub Pages

Projekt je připravený pro GitHub Pages bez vlastní domény. Po pushi do větve
`main` se spustí workflow `.github/workflows/deploy-pages.yml` a web se
publikuje na:

```bash
https://nazgulov.github.io/SMAR-REALITY/
```

Lokální kontrola statického exportu pro GitHub Pages:

```bash
npm run build:pages
```

Statické soubory pro GitHub Pages se při tomto buildu vytvoří ve složce
`pages-out`.

## Přidání nové nemovitosti do mock dat

Do souboru `data/properties.js` přidejte další objekt do pole `properties`.
Novou položku můžete také připravit ve formuláři `/admin/nemovitosti` a
zkopírovat/exportovat výsledný JSON.

Povinná struktura:

```js
{
  id: "novy-byt-praha",
  title: "Nový byt 2+kk",
  type: "prodej", // "prodej" nebo "pronajem"
  price: "8 900 000 Kč",
  location: "Praha",
  size: "61 m²",
  layout: "2+kk, byt",
  shortDescription: "Krátký popis pro kartu.",
  description: "Delší popis pro detail.",
  image: "https://images.unsplash.com/...",
  gallery: [
    "https://images.unsplash.com/...",
    "https://images.unsplash.com/..."
  ],
  matterportUrl: "https://my.matterport.com/show/?m=REALNE_ID",
  mapUrl: "https://mapy.com/s/REALNY_ODKAZ",
  features: ["Balkon", "Sklep", "Parkování"]
}
```

Pokud `matterportUrl` zůstane prázdné, detail zobrazí placeholder iframe s instrukcí, kam později Matterport URL doplnit.
Pro vloženou interaktivní mapu je nejlepší použít iframe z Mapy.com funkce
`Sdílet -> Vložit mapu do vlastních stránek`, typicky se zdrojem
`https://frame.mapy.cz/s/...`. Sdílený odkaz `https://mapy.com/s/...` aplikace
převede na iframe automaticky. Přesná adresa slouží jako odkaz na Mapy.com.

## Doporučený další vývoj

1. Navrhnout databázový model pro nemovitosti, galerie a stav publikace.
2. Přidat Supabase projekt a tabulku `properties`.
3. Přidat autentizaci správce.
4. Vytvořit administrační sekci pro přidání, editaci a mazání nemovitostí.
5. Přidat nahrávání obrázků do Supabase Storage.
6. Doplnit validaci formulářů a náhled před publikací.

## Hlavní soubory

- `app/page.js` - úvodní stránka
- `app/nemovitosti/[id]/page.js` - detail nemovitosti
- `app/sprava-nemovitosti/page.js` - návod ke správě
- `components/` - znovupoužitelné UI komponenty
- `data/properties.js` - lokální mock data
