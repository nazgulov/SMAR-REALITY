create extension if not exists pgcrypto;

create table if not exists public.properties (
  id text primary key,
  title text not null,
  type text not null check (type in ('prodej', 'pronajem')),
  price text not null,
  location text not null,
  size text not null,
  layout text not null,
  short_description text not null,
  description text not null,
  image text not null,
  gallery text[] not null default '{}',
  matterport_url text not null default '',
  features text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.properties enable row level security;

drop policy if exists "Published properties are public" on public.properties;
create policy "Published properties are public"
on public.properties
for select
using (published = true);

drop policy if exists "Authenticated users manage properties" on public.properties;
create policy "Authenticated users manage properties"
on public.properties
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Property images are public" on storage.objects;
create policy "Property images are public"
on storage.objects
for select
using (bucket_id = 'property-images');

drop policy if exists "Authenticated users upload property images" on storage.objects;
create policy "Authenticated users upload property images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'property-images');

drop policy if exists "Authenticated users update property images" on storage.objects;
create policy "Authenticated users update property images"
on storage.objects
for update
to authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

drop policy if exists "Authenticated users delete property images" on storage.objects;
create policy "Authenticated users delete property images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'property-images');
