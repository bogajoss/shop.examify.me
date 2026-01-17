-- Migration: Create orders table
-- Date: 2026-01-17

create table if not exists orders (
  id uuid default uuid_generate_v4() not null primary key,
  student_id uuid not null references users(uid) on delete cascade,
  batch_id uuid not null references batches(id) on delete cascade,
  amount numeric not null default 0,
  
  payment_method varchar(20) not null, -- bKash, Nagad, Rocket
  payment_number varchar(15) not null,
  trx_id varchar(50) not null,
  
  status varchar(20) default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_comment text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_orders_student on orders(student_id);
create index if not exists idx_orders_batch on orders(batch_id);
create index if not exists idx_orders_status on orders(status);
