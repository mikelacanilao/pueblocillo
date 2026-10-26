// Supabase SQL Schema for Pueblocillo Village NDC Housing Project (Brgy. Langkaan, Dasmariñas, Cavite)
// Free-Tier PostgreSQL Ready

export const SUPABASE_SQL_SCHEMA = `-- Pueblocillo NDC Housing Project (Brgy. Langkaan, Dasmariñas, Cavite)
-- Phase 1 Census & Property Schema (Supabase PostgreSQL - Blocks 1 to 23)

-- 1. Village Master Configuration Table
create table if not exists public.village_settings (
  id int primary key default 1,
  village_name text default 'Pueblocillo Village (Brgy. Langkaan, Dasmariñas, Cavite)',
  subdivision_code text default 'PUEBLOCILLO-NDC',
  total_lots_baseline int default 480,
  updated_at timestamptz default now()
);

insert into public.village_settings (id, village_name, subdivision_code, total_lots_baseline)
values (1, 'Pueblocillo Village (Brgy. Langkaan, Dasmariñas, Cavite)', 'PUEBLOCILLO-NDC', 480)
on conflict (id) do update set
  village_name = excluded.village_name,
  total_lots_baseline = excluded.total_lots_baseline;

-- 2. Household Census Table (Primary Property-Linked Entity)
create table if not exists public.households_census (
  id uuid primary key default gen_random_uuid(),
  block_no int not null check (block_no between 1 and 23),
  lot_no int not null check (lot_no >= 1),
  street_name text not null,
  occupancy_type text not null check (occupancy_type in ('owner', 'renter', 'unoccupied', 'vacant_lot')),
  owner_name text not null,
  owner_contact text,
  tenant_name text,
  tenant_contact text,
  total_occupants int not null default 0,
  seniors_count int not null default 0,
  pwd_count int not null default 0,
  vehicles_count int not null default 0,
  vehicle_plates text,
  notes text,
  encoded_by text not null,
  privacy_consent boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (block_no, lot_no)
);

-- Index for fast queries by Block & Lot, Street, and Occupancy
create index if not exists idx_census_block_lot on public.households_census (block_no, lot_no);
create index if not exists idx_census_occupancy on public.households_census (occupancy_type);
create index if not exists idx_census_street on public.households_census (street_name);

-- 3. Row Level Security (RLS) Configuration
alter table public.village_settings enable row level security;
alter table public.households_census enable row level security;

-- Policies for Authenticated Encoders & Admin
create policy "Authenticated users can read village settings"
  on public.village_settings for select
  to authenticated using (true);

create policy "Admins can update village settings"
  on public.village_settings for update
  to authenticated using (auth.jwt() ->> 'role' = 'hoa_admin')
  with check (auth.jwt() ->> 'role' = 'hoa_admin');

create policy "Authenticated encoders and admins can view census"
  on public.households_census for select
  to authenticated using (true);

create policy "Authenticated encoders and admins can insert census"
  on public.households_census for insert
  to authenticated with check (true);

create policy "Authenticated encoders and admins can update census"
  on public.households_census for update
  to authenticated using (true) with check (true);

create policy "Admins can delete census records"
  on public.households_census for delete
  to authenticated using (auth.jwt() ->> 'role' = 'hoa_admin');

-- 4. Future Phase 2 Extension (HOA Dues & Assessment Ledger)
create table if not exists public.hoa_dues_ledger (
  id uuid primary key default gen_random_uuid(),
  block_no int not null,
  lot_no int not null,
  period_month int not null check (period_month between 1 and 12),
  period_year int not null,
  amount numeric(10,2) not null default 300.00,
  status text not null default 'unpaid' check (status in ('paid', 'unpaid', 'waived', 'partial')),
  paid_at timestamptz,
  receipt_no text,
  foreign key (block_no, lot_no) references public.households_census(block_no, lot_no) on delete cascade
);
`;

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const getSupabaseClientConfig = (): SupabaseConfig => {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  };
};
