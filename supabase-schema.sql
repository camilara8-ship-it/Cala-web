-- Ejecutar este script completo en Supabase: proyecto > SQL Editor > New query > pegar > Run

create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  fecha date not null,
  categoria text not null,
  descripcion text not null,
  monto numeric not null default 0,
  created_at timestamptz default now()
);

create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  fecha date not null,
  cliente text,
  producto text not null,
  cantidad numeric not null default 1,
  precio_unitario numeric not null default 0,
  total numeric not null default 0,
  metodo_pago text,
  created_at timestamptz default now()
);

create table if not exists stock (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  producto text not null,
  categoria text,
  cantidad numeric not null default 0,
  unidad text default 'unidad',
  minimo numeric default 0,
  created_at timestamptz default now()
);

-- Seguridad: cada usuario solo ve y edita sus propios datos
alter table gastos enable row level security;
alter table ventas enable row level security;
alter table stock enable row level security;

create policy "gastos_select_own" on gastos for select using (auth.uid() = user_id);
create policy "gastos_insert_own" on gastos for insert with check (auth.uid() = user_id);
create policy "gastos_update_own" on gastos for update using (auth.uid() = user_id);
create policy "gastos_delete_own" on gastos for delete using (auth.uid() = user_id);

create policy "ventas_select_own" on ventas for select using (auth.uid() = user_id);
create policy "ventas_insert_own" on ventas for insert with check (auth.uid() = user_id);
create policy "ventas_update_own" on ventas for update using (auth.uid() = user_id);
create policy "ventas_delete_own" on ventas for delete using (auth.uid() = user_id);

create policy "stock_select_own" on stock for select using (auth.uid() = user_id);
create policy "stock_insert_own" on stock for insert with check (auth.uid() = user_id);
create policy "stock_update_own" on stock for update using (auth.uid() = user_id);
create policy "stock_delete_own" on stock for delete using (auth.uid() = user_id);
