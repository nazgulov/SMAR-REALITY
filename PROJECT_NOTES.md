# SMAR Reality - project notes

Aktualizovano: 2026-06-17

Tento soubor slouzi jako rychla pamet projektu pro navazani prace po znovuotevreni repozitare. Neobsahuje hesla, service role klice ani Supabase anon key.

## Zakladni stav

- Projekt: realitni portal pro SMAR s.r.o.
- Produkcni URL: https://smar-reality.vercel.app
- GitHub repo: https://github.com/nazgulov/SMAR-REALITY.git
- Hlavni vetev: `main`
- Lokalni URL pri vyvoji: http://localhost:3000
- Aktivni hosting pro dynamicky web: Vercel
- GitHub Pages deploy byl z projektu odstranen. Produkcni provoz bezi pres Vercel.

## Technologie

- Next.js App Router
- React
- Tailwind CSS
- Supabase Auth, Database a Storage
- Ikony: `lucide-react`

Hlavni npm prikazy:

```bash
npm install
npm run dev
npm run build
npm run start
```

## Prostredi

Lokalni konfigurace je v `.env.local`. Tento soubor se nesmi commitovat.

Ocekavane promenne:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=property-images
```

Stejne promenne musi byt nastavene i ve Vercelu pro Production a Preview.

## Datovy tok

Verejny web nacita nemovitosti pres `lib/properties.js`.

- Pokud je dostupna Supabase konfigurace, data se nacitaji ze Supabase tabulky `public.properties`.
- Pokud Supabase neni nastavena nebo dotaz selze, web pouzije fallback mock data z `data/properties.js`.
- Produkcni Vercel web je dynamicky a pouziva `unstable_noStore`, aby se zmeny ze Supabase propsaly bez rebuild deploye.

## Supabase databaze

Hlavni tabulka: `public.properties`

Dulezite sloupce:

- `id` - URL slug a primarni klic
- `title`
- `type` - `prodej` nebo `pronajem`
- `price`
- `location`
- `size`
- `plot_area`
- `usable_area`
- `built_up_area`
- `layout`
- `short_description`
- `description`
- `image`
- `gallery` - pole URL obrazku
- `matterport_url`
- `video_url`
- `map_url`
- `features` - pole vlastnosti
- `published`
- `created_at`
- `updated_at`

Storage bucket:

- `property-images`
- Pouziva se pro obrazky a nahrana videa z administrace.

SQL soubory:

- `supabase/schema.sql` - zakladni schema tabulky, storage bucket a jednodussi RLS.
- `supabase/harden-rls.sql` - tvrdsi RLS varianta s allowlistem adminu. Tento soubor je lokalne vedeny jako necommitnuty/untracked; pred commitem zkontrolovat, jestli ho opravdu chceme v repu.
- `supabase/add-admin-user-by-email.sql` - doplni Supabase Auth uzivatele do `public.admin_users` podle e-mailu.
- `supabase/add-property-area-fields.sql` - migrace ploch.
- `supabase/add-property-map-url.sql` - migrace mapy.
- `supabase/add-property-video-url.sql` - migrace videa.
- `supabase/insert-hermanice-property.sql` - jednorazovy insert/update pro konkretni inzerat.

## RLS a admin pristup

Administrace pouziva Supabase Auth.

Pokud je v Supabase aktivni tvrdsi RLS z `harden-rls.sql`, admin ucet musi byt:

1. vytvoren v Supabase Authentication,
2. vlozen do tabulky `public.admin_users`.

Pro pridani admina spustit v Supabase SQL editoru:

```sql
-- soubor supabase/add-admin-user-by-email.sql
admin_email text := 'ADMIN_EMAIL';
```

Hodnotu `ADMIN_EMAIL` nahradit realnym e-mailem admin uctu. Heslo se nikam neuklada.

Typicka RLS chyba v administraci:

- "Supabase RLS nepovolilo akci..."
- Reseni: overit `public.admin_users`, RLS policies a prihlaseny ucet.

## Administrace

URL: `/admin/nemovitosti`

Aktualni chovani:

- Pri prihlaseni se znovu nactou ulozene nemovitosti ze Supabase.
- Pri odhlaseni se stav administrace vycisti.
- Pri spatnych prihlasovacich udajich se zobrazi hlaska.
- Ulozene polozky v pravem panelu lze editovat a mazat.
- Export JSON blok byl odstraneny.
- Informacni bloky "Prototyp bez prihlaseni" a "Pripraveno pro databazi" byly odstranene.

Formular umi:

- automaticky generovat URL slug bez diakritiky podle nazvu,
- vybirat typ nabidky,
- vybirat dispozici,
- zadavat plochu pozemku, uzitnou a zastavenou plochu,
- vybirat hlavni vlastnosti z prednastaveneho seznamu a dopsat vlastni,
- nahrat hlavni obrazek, galerii a video z PC,
- vlozit video URL,
- vlozit Matterport URL,
- vlozit mapu/adresu pres Mapy.com.

## Routy

- `/` - homepage s hero sekci, testovacim upozornenim a filtrem nemovitosti.
- `/nemovitosti/[id]` - detail nemovitosti.
- `/admin/nemovitosti` - administrace nabidek.
- `/kontakt` - kontaktni stranka.
- `/pro-maklere` - stranka pro maklere.
- `/sprava-nemovitosti` - starsi informacni stranka; neni v hlavnim menu.

## Kontaktni udaje

Soubor: `data/contact.js`

- E-mail: `info@smar.cz`
- Telefon: `+420 605 411 111`
- Adresa: `SMAR s.r.o., Skroupova 1397/48, Chomutov 43001`
- Datova schranka: `p85emqn`

## Dulezite soubory

- `app/page.js` - homepage.
- `app/admin/nemovitosti/page.js` - wrapper administrace.
- `components/AdminPropertyForm.jsx` - hlavni logika administrace.
- `components/HomePropertyBrowser.jsx` - filtrovani nabidek na homepage.
- `components/PropertyDetail.jsx` - detail nemovitosti.
- `components/MapEmbed.jsx` - mapa.
- `components/VideoEmbed.jsx` - video.
- `components/MatterportEmbed.jsx` - Matterport iframe.
- `lib/properties.js` - nacitani nemovitosti ze Supabase/fallback dat.
- `lib/property-mappers.js` - mapovani mezi Supabase sloupci a React objektem.
- `lib/supabase/client.js` - Supabase klient a kontrola env vars.
- `data/properties.js` - fallback mock data.
- `data/contact.js` - kontaktni udaje.

## Git workflow

Pred dokoncenim zmen:

```bash
npm run build
git status --short --branch
git add <soubory>
git commit -m "Popis zmeny"
git push
```

Pozor:

- `.env.local` nikdy necommitovat.
- Hesla a Supabase service role key nikdy nepsat do repozitare.
- `supabase/harden-rls.sql` je aktualne lokalni/untracked soubor, kontrolovat pred commitem.

## Posledni dulezite zmeny

- Stabilizovane prihlasovani/odhlasovani v administraci.
- Po prihlaseni se znovu nacitaji nemovitosti ze Supabase.
- Odstranen JSON export v administraci.
- Odstraneny stare info boxy v hlavicce administrace.
- Web stale zobrazuje upozorneni, ze jde o testovaci verzi na docasne domene.
