-- ============================================================
-- DuelBet — схема базы данных Supabase
-- Выполни этот SQL в Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Матчи
create table if not exists matches (
  id          uuid primary key default gen_random_uuid(),
  game        text not null,
  game_icon   text not null default '🎮',
  p1_name     text not null,
  p1_emoji    text not null default '🐍',
  p1_bets     integer not null default 0,
  p2_name     text not null,
  p2_emoji    text not null default '🦊',
  p2_bets     integer not null default 0,
  status      text not null default 'live' check (status in ('live','soon','done')),
  stream_url  text default '',
  winner      text default null,
  created_at  timestamptz default now()
);

-- 2. Ставки пользователей
create table if not exists bets (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid references matches(id) on delete cascade,
  user_name   text not null default 'Аноним',
  player      text not null check (player in ('p1','p2')),
  amount      integer not null check (amount >= 50),
  created_at  timestamptz default now()
);

-- 3. Индексы для быстрых запросов
create index if not exists bets_match_id_idx on bets(match_id);
create index if not exists matches_status_idx on matches(status);

-- 4. Включаем Realtime для live-обновлений
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table bets;

-- 5. Row Level Security — разрешаем публичное чтение, запись всем
alter table matches enable row level security;
alter table bets enable row level security;

create policy "Все могут читать матчи"
  on matches for select using (true);

create policy "Все могут создавать матчи"
  on matches for insert with check (true);

create policy "Все могут обновлять матчи"
  on matches for update using (true);

create policy "Все могут читать ставки"
  on bets for select using (true);

create policy "Все могут делать ставки"
  on bets for insert with check (true);

-- 6. Тестовые данные (опционально — удали если не нужны)
insert into matches (game, game_icon, p1_name, p1_emoji, p1_bets, p2_name, p2_emoji, p2_bets, status, stream_url)
values
  ('CS2', '🎮', 'Артём', '🐍', 7200, 'Пашка', '🦊', 3800, 'live', 'https://twitch.tv/artempro'),
  ('Brawl Stars', '⭐', 'Влад', '🐯', 2100, 'Дима', '🦅', 5400, 'live', 'https://twitch.tv/vladshow'),
  ('Valorant', '🔺', 'Кира', '🌙', 0, 'Саша', '⚡', 0, 'soon', '');
