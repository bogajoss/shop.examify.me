-- Enable only necessary extensions
create extension if not exists "uuid-ossp";

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('admin', 'moderator');
    END IF;
END$$;

create table if not exists files (
  id uuid default uuid_generate_v4() not null primary key,
  original_filename varchar(255) not null,
  display_name varchar(255),
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total_questions integer default 0,
  external_id varchar(50),
  batch_id varchar(50),
  set_id varchar(50),
  is_bank boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_files_bank on files(is_bank);
create index if not exists idx_files_uploaded on files(uploaded_at);
create index if not exists idx_files_batch on files(batch_id);

create table if not exists questions (
  id uuid default uuid_generate_v4() not null primary key,
  file_id uuid not null references files(id) on delete cascade,
  question_text text,
  option1 text,
  option2 text,
  option3 text,
  option4 text,
  option5 text,
  answer varchar(10),
  explanation text,
  question_image text,
  explanation_image text,
  subject varchar(100),
  paper varchar(100),
  chapter varchar(255),
  highlight varchar(255),
  section varchar(255),
  type integer default 0,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_questions_file on questions(file_id);
create index if not exists idx_questions_order on questions(order_index);
create index if not exists idx_questions_subject on questions(subject);
create index if not exists idx_questions_section on questions(section);
create index if not exists idx_file_question on questions(file_id, id);

create table if not exists admins (
  uid uuid default uuid_generate_v4() not null primary key,
  username text unique not null,
  password text not null,
  name text,
  role admin_role default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_admins_username on admins(username);

create table if not exists batches (
  id uuid default uuid_generate_v4() not null primary key,
  name text not null,
  description text,
  icon_url text,
  price numeric default 0,
  old_price numeric default 0,
  category text,
  features jsonb default '[]',
  is_public boolean default false,
  tasks_enabled boolean default false,
  status text default 'live' check (status in ('live', 'ended')),
  created_by uuid references admins(uid) on delete set null,
  todo_start_time text,
  todo_end_time text,
  mandatory_start_time text,
  mandatory_end_time text,
  optional_start_time text,
  optional_end_time text,
  offer_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_batches_status on batches(status);
create index if not exists idx_batches_public on batches(is_public);
create index if not exists idx_batches_category on batches(category);
create index if not exists idx_batches_tasks_enabled on batches(tasks_enabled);
create index if not exists idx_batches_created_by on batches(created_by);

create table if not exists users (
  uid uuid default uuid_generate_v4() not null primary key,
  name text,
  roll text unique not null,
  pass text not null,
  enrolled_batches uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_users_enrolled_batches on users using gin(enrolled_batches);
create index if not exists idx_users_roll on users(roll);

create table if not exists exams (
  id uuid default uuid_generate_v4() not null primary key,
  name text not null,
  description text,
  course_name text,
  batch_id uuid references batches(id) on delete cascade,
  duration_minutes integer default 120,
  negative_marks_per_wrong numeric(4,2) default 0.25,
  file_id uuid references files(id) on delete set null,
  is_practice boolean default false,
  number_of_attempts text default 'one_time' check (number_of_attempts in ('one_time', 'multiple')),
  status text default 'draft' check (status in ('draft', 'live', 'ended')),
  start_at timestamp with time zone,
  end_at timestamp with time zone,
  shuffle_sections_only boolean default false,
  shuffle_questions boolean default false,
  marks_per_question numeric default 1,
  total_subjects integer,
  mandatory_subjects jsonb,
  optional_subjects jsonb,
  created_by uuid references admins(uid) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_exams_batch_id on exams(batch_id);
create index if not exists idx_exams_status on exams(status);
create index if not exists idx_exams_file_id on exams(file_id);
create index if not exists idx_exams_created_by on exams(created_by);
create index if not exists idx_exams_start_end on exams(start_at, end_at);

create table if not exists exam_questions (
  id uuid default uuid_generate_v4() not null primary key,
  exam_id uuid not null references exams(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(exam_id, question_id)
);

create index if not exists idx_exam_questions_exam on exam_questions(exam_id);
create index if not exists idx_exam_questions_question on exam_questions(question_id);
create index if not exists idx_exam_questions_order on exam_questions(exam_id, order_index);

create table if not exists student_exams (
  id uuid default uuid_generate_v4() not null primary key,
  exam_id uuid not null references exams(id) on delete cascade,
  student_id uuid not null references users(uid) on delete cascade,
  score numeric(5,2) default 0,
  correct_answers integer default 0,
  wrong_answers integer default 0,
  unattempted integer default 0,
  started_at timestamp with time zone,
  submitted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, exam_id)
);

create index if not exists idx_student_exams_student_id on student_exams(student_id);
create index if not exists idx_student_exams_exam_id on student_exams(exam_id);
create index if not exists idx_student_exams_submitted on student_exams(submitted_at);

create table if not exists daily_records (
  id uuid default uuid_generate_v4() not null primary key,
  student_id uuid not null references users(uid) on delete cascade,
  exams_attempted integer default 0,
  questions_solved integer default 0,
  record_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, record_date)
);

create index if not exists idx_daily_records_student on daily_records(student_id);
create index if not exists idx_daily_records_date on daily_records(record_date);
create index if not exists idx_daily_records_student_date on daily_records(student_id, record_date);

create table if not exists student_attendance (
  id uuid default uuid_generate_v4() not null primary key,
  student_id uuid not null references users(uid) on delete cascade,
  batch_id uuid not null references batches(id) on delete cascade,
  attendance_date date default current_date,
  present boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, batch_id, attendance_date)
);

create index if not exists idx_attendance_student on student_attendance(student_id);
create index if not exists idx_attendance_batch on student_attendance(batch_id);
create index if not exists idx_attendance_date on student_attendance(attendance_date);
create index if not exists idx_attendance_present on student_attendance(present);

create table if not exists student_tasks (
  id uuid default uuid_generate_v4() not null primary key,
  student_id uuid not null references users(uid) on delete cascade,
  batch_id uuid not null references batches(id) on delete cascade,
  task_date date default current_date,
  mandatory_done boolean default false,
  optional_done boolean default false,
  todo_done boolean default false,
  mandatory_url text,
  optional_url text,
  todo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, batch_id, task_date)
);

create index if not exists idx_student_tasks_student on student_tasks(student_id);
create index if not exists idx_student_tasks_batch on student_tasks(batch_id);
create index if not exists idx_student_tasks_date on student_tasks(task_date);

create table if not exists enrollment_tokens (
  id uuid default uuid_generate_v4() not null primary key,
  token varchar(16) unique not null,
  batch_id uuid not null references batches(id) on delete cascade,
  created_by uuid not null references admins(uid) on delete set null,
  
  is_used boolean default false,
  used_by uuid references users(uid) on delete set null,
  used_at timestamp with time zone,
  
  expires_at timestamp with time zone,
  max_uses integer default 1,
  current_uses integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_tokens_batch on enrollment_tokens(batch_id);
create index if not exists idx_tokens_token on enrollment_tokens(token);
create index if not exists idx_tokens_is_used on enrollment_tokens(is_used);
create index if not exists idx_tokens_created_by on enrollment_tokens(created_by);
create index if not exists idx_tokens_expires on enrollment_tokens(expires_at);

create table if not exists token_usage_log (
  id uuid default uuid_generate_v4() not null primary key,
  token_id uuid not null references enrollment_tokens(id) on delete cascade,
  student_id uuid not null references users(uid) on delete cascade,
  batch_id uuid not null references batches(id) on delete cascade,
  ip_address varchar(45),
  user_agent text,
  used_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_usage_log_token on token_usage_log(token_id);
create index if not exists idx_usage_log_student on token_usage_log(student_id);
create index if not exists idx_usage_log_batch on token_usage_log(batch_id);-- Migration: Create orders table
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
-- Migration: Add assigned_token to orders
-- Date: 2026-01-17

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS assigned_token varchar(50);

-- Migration: Add default_approval_message to batches
-- Date: 2026-01-20

ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS default_approval_message text;
-- Migration: Add phone column to users table
-- Date: 2026-01-18

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS practice_after_live boolean DEFAULT true;
ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS linked_batch_ids uuid[] DEFAULT '{}';
-- Migration: Add batch_id to student_exams
-- Date: 2026-01-24

ALTER TABLE student_exams 
ADD COLUMN IF NOT EXISTS batch_id uuid REFERENCES batches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_student_exams_batch_id ON student_exams(batch_id);
-- Migration: Add editable stats to batches
-- Date: 2026-01-24

ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS live_exams text DEFAULT '০+',
ADD COLUMN IF NOT EXISTS lecture_notes text DEFAULT '০+',
ADD COLUMN IF NOT EXISTS standard_exams text DEFAULT '০+',
ADD COLUMN IF NOT EXISTS solve_sheets text DEFAULT '০+';
-- Migration: Create blogs table
-- Date: 2026-01-24

create table if not exists blogs (
  id uuid default uuid_generate_v4() not null primary key,
  title text not null,
  content text not null,
  excerpt text,
  image_url text,
  category text default 'General',
  author text default 'Admin',
  status text default 'published' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_blogs_status on blogs(status);
create index if not exists idx_blogs_created_at on blogs(created_at);
-- Migration: Add dynamic stats to batches
-- Date: 2026-01-24

ALTER TABLE batches 
ADD COLUMN IF NOT EXISTS batch_stats jsonb DEFAULT '[]';
-- Migration: Add slug to blogs
-- Date: 2026-01-24

ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Generate initial slugs for existing blogs if any
UPDATE blogs SET slug = id::text WHERE slug IS NULL;

ALTER TABLE blogs ALTER COLUMN slug SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
