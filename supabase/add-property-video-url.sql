alter table public.properties
add column if not exists video_url text not null default '';
