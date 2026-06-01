-- Users profile (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  xp integer default 0,
  streak integer default 0,
  last_seen date default current_date,
  created_at timestamptz default now()
);

-- Hebrew word dictionary
create table public.words (
  id uuid primary key default gen_random_uuid(),
  hebrew text not null,           -- word with nikud: שָׁלוֹם
  transliteration text not null,  -- shalom
  translation text not null,      -- мир, привет
  level text default 'intermediate',
  topic text,
  ai_content jsonb,               -- cached AI explanation + examples
  created_at timestamptz default now()
);

-- Per-user SRS progress for each word
create table public.user_words (
  user_id uuid references public.users(id) on delete cascade,
  word_id uuid references public.words(id) on delete cascade,
  interval integer default 1,
  ease_factor numeric default 2.5,
  repetitions integer default 0,
  next_review timestamptz default now(),
  primary key (user_id, word_id)
);

-- Lessons
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text not null,
  level text default 'intermediate',
  content_json jsonb,
  created_at timestamptz default now()
);

-- Per-user lesson progress
create table public.user_lessons (
  user_id uuid references public.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  score integer default 0,
  primary key (user_id, lesson_id)
);

-- Auto-create user profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS policies
alter table public.users enable row level security;
alter table public.user_words enable row level security;
alter table public.user_lessons enable row level security;
alter table public.words enable row level security;
alter table public.lessons enable row level security;

create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can manage own word progress" on public.user_words for all using (auth.uid() = user_id);
create policy "Users can manage own lesson progress" on public.user_lessons for all using (auth.uid() = user_id);
create policy "Words are public" on public.words for select using (true);
create policy "Lessons are public" on public.lessons for select using (true);

-- Sample words
insert into public.words (hebrew, transliteration, translation, topic) values
  ('שָׁלוֹם', 'shalom', 'мир, привет, пока', 'greetings'),
  ('תּוֹדָה', 'toda', 'спасибо', 'greetings'),
  ('בְּבַקָּשָׁה', 'bevakasha', 'пожалуйста', 'greetings'),
  ('כֵּן', 'ken', 'да', 'basics'),
  ('לֹא', 'lo', 'нет', 'basics'),
  ('מַיִם', 'mayim', 'вода', 'food'),
  ('לֶחֶם', 'lechem', 'хлеб', 'food'),
  ('בַּיִת', 'bayit', 'дом', 'home'),
  ('מִשְׁפָּחָה', 'mishpacha', 'семья', 'home'),
  ('עֲבוֹדָה', 'avoda', 'работа', 'work');
