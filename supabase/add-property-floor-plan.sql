alter table public.properties
add column if not exists floor_plan text not null default '';
