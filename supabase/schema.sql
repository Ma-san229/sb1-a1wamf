-- Value tags table
create table value_tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  point_value integer not null default 1,
  category text check (category in ('culture', 'principle', 'behavior')) not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Memory value tags relation
create table memory_value_tags (
  id uuid default uuid_generate_v4() primary key,
  memory_id uuid references memories(id) on delete cascade,
  tag_id uuid references value_tags(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(memory_id, tag_id)
);

-- User points table
create table user_points (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  points integer not null default 0,
  level integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Point history table
create table point_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  memory_id uuid references memories(id) on delete cascade,
  points integer not null,
  reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS policies for value tags
create policy "Anyone can view value tags"
  on value_tags for select
  using (true);

create policy "Only admins can modify value tags"
  on value_tags for all
  using (auth.uid() in (select user_id from admin_users));

-- RLS policies for memory value tags
create policy "Anyone can view memory value tags"
  on memory_value_tags for select
  using (true);

create policy "Users can add value tags to their memories"
  on memory_value_tags for insert
  with check (
    auth.uid() in (
      select user_id from memories where id = memory_id
    )
  );

-- RLS policies for user points
create policy "Users can view their own points"
  on user_points for select
  using (auth.uid() = user_id);

create policy "System can modify user points"
  on user_points for all
  using (auth.uid() in (select user_id from admin_users));

-- RLS policies for point history
create policy "Users can view their point history"
  on point_history for select
  using (auth.uid() = user_id);

-- Trigger to update user points
create or replace function update_user_points()
returns trigger as $$
begin
  insert into user_points (user_id, points)
  values (new.user_id, new.points)
  on conflict (user_id)
  do update set
    points = user_points.points + new.points,
    level = floor(sqrt(user_points.points + new.points) / 10) + 1,
    updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_point_history_insert
  after insert on point_history
  for each row
  execute function update_user_points();