-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  email text unique not null,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Memories table
create table public.memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  recipient text not null,
  message text not null,
  date date not null,
  scheduled_date date,
  image_url text,
  template_id uuid references public.templates(id),
  is_public boolean default false,
  status text check (status in ('draft', 'scheduled', 'sent', 'failed')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sent_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- Templates table
create table public.templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  category text not null,
  is_public boolean default false,
  usage_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

-- Template tags table
create table public.template_tags (
  id uuid default uuid_generate_v4() primary key,
  template_id uuid references public.templates(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Memory likes table
create table public.memory_likes (
  id uuid default uuid_generate_v4() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(memory_id, user_id)
);

-- Memory comments table
create table public.memory_comments (
  id uuid default uuid_generate_v4() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('like', 'comment', 'mention', 'follow', 'system')),
  title text not null,
  content text not null,
  is_read boolean default false,
  action_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Relationships table (for following/followers)
create table public.relationships (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

-- Value tags table
create table public.value_tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  point_value integer not null default 1,
  category text check (category in ('culture', 'principle', 'behavior')) not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Memory value tags relation
create table public.memory_value_tags (
  id uuid default uuid_generate_v4() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  tag_id uuid references public.value_tags(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(memory_id, tag_id)
);

-- User points table
create table public.user_points (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  points integer not null default 0,
  level integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Point history table
create table public.point_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  memory_id uuid references public.memories(id) on delete cascade,
  points integer not null,
  reason text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index memories_user_id_idx on public.memories(user_id);
create index memories_status_idx on public.memories(status);
create index memories_scheduled_date_idx on public.memories(scheduled_date);
create index templates_user_id_idx on public.templates(user_id);
create index memory_likes_memory_id_idx on public.memory_likes(memory_id);
create index memory_comments_memory_id_idx on public.memory_comments(memory_id);
create index notifications_user_id_idx on public.notifications(user_id);
create index relationships_follower_id_idx on public.relationships(follower_id);
create index relationships_following_id_idx on public.relationships(following_id);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.memories enable row level security;
alter table public.templates enable row level security;
alter table public.template_tags enable row level security;
alter table public.memory_likes enable row level security;
alter table public.memory_comments enable row level security;
alter table public.notifications enable row level security;
alter table public.relationships enable row level security;
alter table public.value_tags enable row level security;
alter table public.memory_value_tags enable row level security;
alter table public.user_points enable row level security;
alter table public.point_history enable row level security;

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Memories policies
create policy "Memories are viewable by owner and public ones by everyone"
  on public.memories for select
  using (
    auth.uid() = user_id
    or (is_public = true and status = 'sent')
  );

create policy "Users can create their own memories"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own memories"
  on public.memories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own memories"
  on public.memories for delete
  using (auth.uid() = user_id);

-- Templates policies
create policy "Templates are viewable by owner and public ones by everyone"
  on public.templates for select
  using (
    auth.uid() = user_id
    or is_public = true
  );

create policy "Users can create their own templates"
  on public.templates for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own templates"
  on public.templates for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own templates"
  on public.templates for delete
  using (auth.uid() = user_id);

-- Functions and Triggers

-- Function to update user points
create or replace function update_user_points()
returns trigger as $$
begin
  insert into public.user_points (user_id, points)
  values (new.user_id, new.points)
  on conflict (user_id)
  do update set
    points = user_points.points + new.points,
    level = floor(sqrt(user_points.points + new.points) / 10) + 1,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for point history
create trigger on_point_history_insert
  after insert on public.point_history
  for each row
  execute function update_user_points();

-- Function to handle memory likes
create or replace function handle_memory_like()
returns trigger as $$
begin
  -- Insert points for receiving a like
  if (TG_OP = 'INSERT') then
    insert into public.point_history (user_id, memory_id, points, reason)
    select 
      m.user_id,
      new.memory_id,
      1,
      'Received a like on memory'
    from public.memories m
    where m.id = new.memory_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for memory likes
create trigger on_memory_like
  after insert on public.memory_likes
  for each row
  execute function handle_memory_like();

-- Function to handle memory comments
create or replace function handle_memory_comment()
returns trigger as $$
begin
  -- Insert points for receiving a comment
  if (TG_OP = 'INSERT') then
    insert into public.point_history (user_id, memory_id, points, reason)
    select 
      m.user_id,
      new.memory_id,
      2,
      'Received a comment on memory'
    from public.memories m
    where m.id = new.memory_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for memory comments
create trigger on_memory_comment
  after insert on public.memory_comments
  for each row
  execute function handle_memory_comment();

-- Function to create notification
create or replace function create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_content text,
  p_action_url text default null
) returns void as $$
begin
  insert into public.notifications (
    user_id,
    type,
    title,
    content,
    action_url
  ) values (
    p_user_id,
    p_type,
    p_title,
    p_content,
    p_action_url
  );
end;
$$ language plpgsql security definer;