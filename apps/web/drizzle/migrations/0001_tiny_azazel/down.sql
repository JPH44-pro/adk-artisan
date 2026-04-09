-- Down migration for: 0001_tiny_azazel
--
-- Removes auth.users → public.users sync trigger and function.
--
-- WARNINGS:
-- - After rollback, new signups will not auto-insert into public.users until
--   the trigger migration is re-applied.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
