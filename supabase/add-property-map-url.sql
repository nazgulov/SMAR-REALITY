alter table public.properties
add column if not exists map_url text not null default '';
