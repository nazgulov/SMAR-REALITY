# SMAR Reality Wireframe

Moderní wireframe realitního webu pro firmu **SMAR s.r.o.**. Projekt používá Next.js App Router, React, Tailwind CSS a lokální mock data bez backendu.

## Co je hotové

- úvodní stránka s hero sekcí a přehledem nemovitostí
- rozdělení nabídek na prodej a pronájem
- detail každé nemovitosti na trase `/nemovitosti/[id]`
- Matterport iframe blok s placeholderem pro budoucí URL
- informační stránka `/sprava-nemovitosti`
- responzivní layout pro desktop, tablet i mobil
- data v souboru `data/properties.js`

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

## Přidání nové nemovitosti do mock dat

Do souboru `data/properties.js` přidejte další objekt do pole `properties`.

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
  features: ["Balkon", "Sklep", "Parkování"]
}
```

Pokud `matterportUrl` zůstane prázdné, detail zobrazí placeholder iframe s instrukcí, kam později Matterport URL doplnit.

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
