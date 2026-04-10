-- =====================================================================
-- PlayWithAStar — database schema + seed data
-- Run this once in Supabase SQL Editor.
-- =====================================================================

-- ===== PROFILES (extends auth.users) =====
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('fan', 'athlete')),
  name text not null,
  email text not null,
  athlete_id uuid,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'fan'),
    coalesce(new.raw_user_meta_data->>'name', 'Anonymous'),
    new.email
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===== ATHLETES =====
create table if not exists public.athletes (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  sport text not null,
  position text not null,
  team text,
  location text,
  initials text,
  photo text,
  rating numeric default 0,
  reviews_count int default 0,
  response_time text default 'Usually responds in a few hours',
  bio text,
  verified boolean default false,
  color text default '#6366f1',
  career_games_played text,
  career_goals text,
  career_assists text,
  career_championships text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table public.athletes enable row level security;
create policy "athletes_select_all" on public.athletes for select using (true);
create policy "athletes_insert_own" on public.athletes for insert with check (auth.uid() = owner_user_id);
create policy "athletes_update_own" on public.athletes for update using (auth.uid() = owner_user_id);

-- ===== EXPERIENCES =====
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  duration text not null,
  price int not null,
  active boolean default true,
  created_at timestamptz default now()
);

alter table public.experiences enable row level security;
create policy "experiences_select_all" on public.experiences for select using (true);
create policy "experiences_write_owner" on public.experiences
  for all using (
    exists(select 1 from public.athletes a where a.id = athlete_id and a.owner_user_id = auth.uid())
  );

-- ===== AVAILABILITY =====
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  slot_date date not null,
  slot_time text not null,
  unique(athlete_id, slot_date, slot_time)
);

alter table public.availability enable row level security;
create policy "availability_select_all" on public.availability for select using (true);
create policy "availability_write_owner" on public.availability
  for all using (
    exists(select 1 from public.athletes a where a.id = athlete_id and a.owner_user_id = auth.uid())
  );

-- ===== BOOKINGS =====
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  fan_id uuid not null references auth.users(id) on delete cascade,
  fan_name text not null,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  experience_id uuid not null references public.experiences(id),
  experience_title text not null,
  booking_date date not null,
  booking_time text not null,
  total int not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined', 'cancelled', 'completed')),
  payment_ref text,
  created_at timestamptz default now()
);

alter table public.bookings enable row level security;
create policy "bookings_select_involved" on public.bookings
  for select using (
    auth.uid() = fan_id
    or exists(select 1 from public.athletes a where a.id = athlete_id and a.owner_user_id = auth.uid())
  );
create policy "bookings_insert_fan" on public.bookings for insert with check (auth.uid() = fan_id);
create policy "bookings_update_involved" on public.bookings
  for update using (
    auth.uid() = fan_id
    or exists(select 1 from public.athletes a where a.id = athlete_id and a.owner_user_id = auth.uid())
  );

-- ===== MESSAGES =====
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  from_user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
create policy "messages_select_involved" on public.messages
  for select using (
    exists(
      select 1 from public.bookings b
      where b.id = booking_id
      and (b.fan_id = auth.uid()
           or exists(select 1 from public.athletes a where a.id = b.athlete_id and a.owner_user_id = auth.uid()))
    )
  );
create policy "messages_insert_involved" on public.messages
  for insert with check (
    auth.uid() = from_user_id
    and exists(
      select 1 from public.bookings b
      where b.id = booking_id
      and (b.fan_id = auth.uid()
           or exists(select 1 from public.athletes a where a.id = b.athlete_id and a.owner_user_id = auth.uid()))
    )
  );

-- ===== REVIEWS =====
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique references public.bookings(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  fan_id uuid not null references auth.users(id) on delete cascade,
  fan_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  body text not null,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;
create policy "reviews_select_all" on public.reviews for select using (true);
create policy "reviews_insert_fan" on public.reviews for insert with check (auth.uid() = fan_id);

-- ===== FAVORITES =====
create table if not exists public.favorites (
  user_id uuid references auth.users(id) on delete cascade,
  athlete_id uuid references public.athletes(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, athlete_id)
);

alter table public.favorites enable row level security;
create policy "favorites_select_own" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites for delete using (auth.uid() = user_id);

-- ===== SEED DATA: 8 ATHLETES =====
insert into public.athletes (id, name, sport, position, team, location, initials, photo, rating, reviews_count, response_time, bio, verified, color, career_games_played, career_goals, career_assists, career_championships, tags)
values
  ('11111111-1111-1111-1111-111111111001', 'Mike Branson', 'Hockey', 'Former NHL Forward', 'Toronto Maple Leafs (Retired)', 'Toronto, ON', 'MB', 'https://i.pravatar.cc/800?img=12', 4.9, 47, 'Usually responds in 2 hours', '14-year NHL veteran who played 800+ games. Passionate about giving back to the hockey community and connecting with fans. Whether it''s skating with your kids'' team or joining your beer league, I bring the energy!', true, '#1e3a8a', '847', '205', '312', '1 Cup', array['hockey','skating','training','nhl']),
  ('11111111-1111-1111-1111-111111111002', 'Serena Hayes', 'Tennis', 'Former WTA Pro', 'Independent', 'Toronto, ON', 'SH', 'https://i.pravatar.cc/800?img=5', 4.8, 39, 'Usually responds in 3 hours', '12 years on the professional tennis circuit. I love coaching and playing with aspiring athletes. Let''s improve your game or just have fun on the court!', true, '#7c2d12', '800+ matches', '35 titles', 'Top 50 globally', null, array['tennis','coaching','sports']),
  ('11111111-1111-1111-1111-111111111003', 'Alex Rodriguez', 'Baseball', 'Former MLB Pitcher', 'Toronto Blue Jays (Retired)', 'Toronto, ON', 'AR', 'https://i.pravatar.cc/800?img=33', 4.7, 28, 'Usually responds in 4 hours', 'Pitched for 15 years across multiple MLB teams. Love teaching the next generation about baseball fundamentals and the mental side of sports.', false, '#1e40af', '487', '200+ wins', '1200+ Ks', null, array['baseball','pitching','sports']),
  ('11111111-1111-1111-1111-111111111004', 'Jordan Matthews', 'Basketball', 'Former NBA Guard', 'Toronto Raptors (Retired)', 'Toronto, ON', 'JM', 'https://i.pravatar.cc/800?img=68', 4.9, 56, 'Usually responds in 1 hour', 'Spent 10 years in the NBA bringing intensity to the court. Now dedicated to coaching youth and adult players to reach their potential.', true, '#7c3aed', '687', '7500+ pts', '3200+ ast', null, array['basketball','training','nba']),
  ('11111111-1111-1111-1111-111111111005', 'Emma Wilson', 'Soccer', 'Former NWSL Forward', 'Toronto FC Women (Retired)', 'Toronto, ON', 'EW', 'https://i.pravatar.cc/800?img=49', 4.8, 42, 'Usually responds in 2 hours', 'International soccer player with 50+ caps for Canada. Passionate about growing women''s soccer and mentoring young athletes.', true, '#059669', '200+ apps', '40 goals', 'International', null, array['soccer','women''s sports','training']),
  ('11111111-1111-1111-1111-111111111006', 'Marcus Thompson', 'Football', 'Former CFL Running Back', 'Toronto Argonauts (Retired)', 'Toronto, ON', 'MT', 'https://i.pravatar.cc/800?img=60', 4.6, 33, 'Usually responds in 5 hours', 'Explosive runner with a passion for mentoring the next generation of CFL stars. Let''s work on your footwork and athletic potential!', false, '#b91c1c', '156', '3400+ rush yds', '30 TDs', null, array['football','cfl','training']),
  ('11111111-1111-1111-1111-111111111007', 'Nicole Chen', 'Gymnastics', 'Former National Team Member', 'Canada Gymnastics (Retired)', 'Toronto, ON', 'NC', 'https://i.pravatar.cc/800?img=25', 4.9, 51, 'Usually responds in 1 hour', 'Competed at the national level in artistic gymnastics. Now coaching and mentoring young gymnasts. I make fitness fun and accessible!', true, '#db2777', '15 nat. champs', 'Multiple medals', 'Coach since 2015', null, array['gymnastics','fitness','coaching']),
  ('11111111-1111-1111-1111-111111111008', 'David Park', 'Esports', 'Former Pro Gamer', 'Immortals Gaming (Retired)', 'Toronto, ON', 'DP', 'https://i.pravatar.cc/800?img=15', 4.7, 44, 'Usually responds in 2 hours', 'Competed in professional esports for 8 years. Now coaching aspiring gamers and creating content. Let''s level up your game!', true, '#0891b2', '1000+ matches', '15 tourney wins', 'Top 5 ranking', null, array['esports','gaming','coaching'])
on conflict (id) do nothing;

-- ===== SEED DATA: EXPERIENCES =====
insert into public.experiences (athlete_id, title, description, category, duration, price)
values
  ('11111111-1111-1111-1111-111111111001', 'Skate With Your Kids'' Team', 'I''ll join your kids'' hockey practice or game for a full session. Includes skills tips, a mini scrimmage, and photos with the team.', 'Skating', '90 min', 450),
  ('11111111-1111-1111-1111-111111111001', 'Golf Foursome Partner', 'Join me for 18 holes at your local GTA course. Includes friendly competition, stories from the NHL, and plenty of laughs.', 'Golf', '4-5 hours', 800),
  ('11111111-1111-1111-1111-111111111001', '1-on-1 Hockey Training', 'Personalized on-ice training session focused on skating, shooting, and game sense.', 'Training', '60 min', 350),
  ('11111111-1111-1111-1111-111111111002', 'Tennis Coaching Session', 'One-on-one coaching to improve your serve, volley, and strategy.', 'Training', '90 min', 300),
  ('11111111-1111-1111-1111-111111111002', 'Tennis Match & Social', 'Play a casual match with me and grab coffee after.', 'Other', '120 min', 250),
  ('11111111-1111-1111-1111-111111111003', 'Baseball Pitching Clinic', 'Learn pitching mechanics, grip, and strategy from a former pro.', 'Training', '120 min', 400),
  ('11111111-1111-1111-1111-111111111003', 'Catch & Chat', 'Play catch, discuss baseball strategy, and hear behind-the-scenes stories.', 'Other', '90 min', 200),
  ('11111111-1111-1111-1111-111111111004', '1-on-1 Basketball Training', 'Work on your shooting, handles, and game IQ with an NBA vet.', 'Training', '90 min', 350),
  ('11111111-1111-1111-1111-111111111004', 'Pickup Game', 'Join a casual 3-on-3 or 5-on-5 game with me and other athletes.', 'Other', '120 min', 150),
  ('11111111-1111-1111-1111-111111111005', 'Soccer Skills Workshop', 'Learn dribbling, shooting, and positioning from a pro striker.', 'Training', '90 min', 300),
  ('11111111-1111-1111-1111-111111111005', 'Pickup Soccer Game', 'Play in a casual, co-ed soccer game with me and friends.', 'Other', '120 min', 100),
  ('11111111-1111-1111-1111-111111111006', 'CFL Training Camp', 'Learn running back techniques from someone who played at the highest level.', 'Training', '120 min', 350),
  ('11111111-1111-1111-1111-111111111006', 'Agility & Speed Work', 'Private training focused on sprinting, footwork, and explosiveness.', 'Training', '90 min', 300),
  ('11111111-1111-1111-1111-111111111007', 'Flexibility & Strength Training', 'Full-body conditioning and flexibility work for better athletic performance.', 'Training', '90 min', 250),
  ('11111111-1111-1111-1111-111111111007', 'Gymnastics Basics Workshop', 'Learn fundamental tumbling and balance skills in a fun, safe environment.', 'Training', '120 min', 200),
  ('11111111-1111-1111-1111-111111111008', 'Esports Coaching', 'One-on-one coaching on strategy, game mechanics, and mental game.', 'Training', '90 min', 180),
  ('11111111-1111-1111-1111-111111111008', 'Tournament Practice', 'Participate in a practice tournament with pro-level competition.', 'Other', '120 min', 150);

-- ===== SEED DATA: AVAILABILITY (next 14 days for every athlete) =====
do $$
declare
  a record;
  day_offset int;
  hour_offset int;
  times text[] := array['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];
begin
  for a in select id from public.athletes loop
    for day_offset in 1..14 loop
      if day_offset % 3 != 0 then
        for hour_offset in 1..4 loop
          insert into public.availability (athlete_id, slot_date, slot_time)
          values (a.id, current_date + day_offset, times[((day_offset + hour_offset) % 8) + 1])
          on conflict do nothing;
        end loop;
      end if;
    end loop;
  end loop;
end $$;

-- ===== REALTIME: enable realtime on messages table =====
alter publication supabase_realtime add table public.messages;

-- Done!
select 'Schema created successfully. Athletes: ' || count(*) from public.athletes;
