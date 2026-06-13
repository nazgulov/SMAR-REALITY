-- Adds a Supabase Auth user to the admin allowlist.
-- Before running this in Supabase SQL editor, replace the value below
-- with the e-mail used for admin login.

do $$
declare
  admin_email text := 'REPLACE_WITH_ADMIN_EMAIL';
  admin_user_id uuid;
begin
  if admin_email = 'REPLACE_WITH_ADMIN_EMAIL' then
    raise exception 'Replace admin_email with the admin e-mail from Supabase Auth.';
  end if;

  select id
  into admin_user_id
  from auth.users
  where email = admin_email
  limit 1;

  if admin_user_id is null then
    raise exception 'No Supabase Auth user found for e-mail: %', admin_email;
  end if;

  insert into public.admin_users (user_id)
  values (admin_user_id)
  on conflict (user_id) do nothing;

  raise notice 'Admin user is allowed: %', admin_user_id;
end $$;
