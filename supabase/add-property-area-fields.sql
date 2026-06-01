alter table public.properties
add column if not exists plot_area text not null default '',
add column if not exists usable_area text not null default '',
add column if not exists built_up_area text not null default '';

update public.properties
set usable_area = size
where usable_area = ''
  and size <> '';
