-- ============================================================
-- Portfolio — schéma Supabase
--
-- À exécuter une fois dans le SQL Editor du projet.
--
-- Avant de lancer : cherchez les trois occurrences de l'adresse
-- guilhemterrier58@gmail.com et remplacez-les si le compte Supabase utilise
-- une autre adresse. C'est elle, et elle seule, qui pourra écrire.
-- ============================================================

-- ------------------------------------------------------------------ contenu
--
-- Un seul document JSON plutôt que des tables normalisées : le CMS édite
-- déjà l'objet `Content` d'un bloc, et le site le lit d'un bloc. Découper en
-- skills / cases / likes n'apporterait rien ici et multiplierait les
-- allers-retours réseau au chargement.

create table if not exists public.site_content (
  id         text primary key default 'main',
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Lecture ouverte : c'est le contenu public du site.
drop policy if exists "lecture publique" on public.site_content;
create policy "lecture publique"
  on public.site_content for select
  using (true);

-- Écriture réservée à une adresse précise. Ne PAS se contenter de
-- `to authenticated` : si les inscriptions sont ouvertes, n'importe qui
-- pourrait créer un compte et réécrire le site.
drop policy if exists "écriture admin" on public.site_content;
create policy "écriture admin"
  on public.site_content for all
  to authenticated
  using (auth.jwt() ->> 'email' = 'guilhemterrier58@gmail.com')
  with check (auth.jwt() ->> 'email' = 'guilhemterrier58@gmail.com');

-- Horodatage automatique, pour savoir quand la dernière publication a eu lieu.
-- search_path figé : sans lui la fonction résout ses identifiants via le
-- search_path de l'appelant, que quelqu'un pouvant créer des objets dans un
-- schéma prioritaire peut détourner.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_touch on public.site_content;
create trigger site_content_touch
  before update on public.site_content
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------------ images
--
-- Bucket public : les URLs sont servies telles quelles dans les <img>, et
-- elles sont stables — contrairement aux assets passés par Vite, dont le nom
-- porte un hash qui change à chaque build.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media lecture publique" on storage.objects;
create policy "media lecture publique"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media écriture admin" on storage.objects;
create policy "media écriture admin"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'media'
    and auth.jwt() ->> 'email' = 'guilhemterrier58@gmail.com'
  )
  with check (
    bucket_id = 'media'
    and auth.jwt() ->> 'email' = 'guilhemterrier58@gmail.com'
  );

-- ------------------------------------------------------------------ rappel
--
-- Dans Authentication → Sign In / Providers, désactivez « Allow new users to
-- sign up ». Les politiques ci-dessus filtrent déjà par adresse, mais fermer
-- les inscriptions retire complètement la surface.

-- ------------------------------------------------- fermeture des inscriptions
--
-- Le réglage « Allow new users to sign up » du dashboard change de place au
-- fil des versions. Ce verrou-ci vit dans le schéma versionné et ne peut pas
-- être défait par mégarde en cliquant ailleurs.
--
-- Ce n'est PAS la protection principale : les politiques ci-dessus refusent
-- déjà toute écriture à un compte qui n'est pas l'adresse admin. C'est la
-- couche qui empêche les comptes parasites d'exister.

create or replace function public.reject_foreign_signups()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from 'guilhemterrier58@gmail.com' then
    raise exception 'Les inscriptions sont fermées sur ce projet.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

-- Une fonction de trigger n'a aucune raison d'être appelable via
-- /rest/v1/rpc/ ; elle est SECURITY DEFINER, donc l'exposer serait offrir une
-- porte inutile. Seul le rôle sous lequel GoTrue insère les comptes en a
-- besoin — sans ce grant, le trigger échouerait sur un « permission denied »
-- au lieu du refus explicite.
revoke all on function public.reject_foreign_signups() from public, anon, authenticated;
grant execute on function public.reject_foreign_signups() to supabase_auth_admin;

drop trigger if exists reject_foreign_signups on auth.users;
create trigger reject_foreign_signups
  before insert on auth.users
  for each row execute function public.reject_foreign_signups();

-- Pour rouvrir les inscriptions plus tard :
--   drop trigger reject_foreign_signups on auth.users;
