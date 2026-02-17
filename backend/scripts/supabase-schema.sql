-- Run this file in Supabase SQL Editor before starting the backend.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id text primary key default gen_random_uuid()::text,
  phone text unique,
  email text unique,
  username text unique,
  password text,
  is_verified boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.otps (
  id bigserial primary key,
  phone text not null,
  otp text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_otps_phone on public.otps(phone);
create index if not exists idx_otps_expires_at on public.otps(expires_at);

create table if not exists public.menu_items (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price numeric(10, 2) not null,
  category_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_menu_items_created_at on public.menu_items(created_at desc);

create table if not exists public.orders (
  id text primary key default gen_random_uuid()::text,
  user_id text,
  customer_name text not null default '',
  customer_username text not null default '',
  address jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  totals jsonb not null default '{}'::jsonb,
  payment_method text not null default 'cod',
  status text not null default 'placed' check (status in ('placed', 'prepared', 'delivered', 'canceled')),
  canceled_seen_by_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  order_id text not null unique,
  user_id text not null,
  username text not null default '',
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  images jsonb not null default '[]'::jsonb,
  is_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reviews_created_at on public.reviews(created_at desc);
create index if not exists idx_reviews_visible on public.reviews(is_visible);

create table if not exists public.push_subscriptions (
  id bigserial primary key,
  endpoint text not null unique,
  keys jsonb not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_push_subscriptions_admin on public.push_subscriptions(is_admin);

create table if not exists public.carts (
  id text primary key default gen_random_uuid()::text,
  user_id text not null unique,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function set_updated_at();

drop trigger if exists otps_set_updated_at on public.otps;
create trigger otps_set_updated_at
before update on public.otps
for each row
execute function set_updated_at();

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at
before update on public.menu_items
for each row
execute function set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
before update on public.reviews
for each row
execute function set_updated_at();

drop trigger if exists push_subscriptions_set_updated_at on public.push_subscriptions;
create trigger push_subscriptions_set_updated_at
before update on public.push_subscriptions
for each row
execute function set_updated_at();

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
before update on public.carts
for each row
execute function set_updated_at();
