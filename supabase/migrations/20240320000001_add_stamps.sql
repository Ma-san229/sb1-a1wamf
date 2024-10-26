-- Create memory stamps table
create table public.memory_stamps (
  id uuid default uuid_generate_v4() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stamp_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(memory_id, user_id, stamp_id)
);

-- Create index for better query performance
create index memory_stamps_memory_id_idx on public.memory_stamps(memory_id);

-- Enable RLS
alter table public.memory_stamps enable row level security;

-- RLS policies for memory stamps
create policy "Memory stamps are viewable by everyone"
  on public.memory_stamps for select
  using (true);

create policy "Users can add stamps"
  on public.memory_stamps for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own stamps"
  on public.memory_stamps for delete
  using (auth.uid() = user_id);

-- Function to handle memory stamps
create or replace function handle_memory_stamp()
returns trigger as $$
begin
  -- Insert points for receiving a stamp
  if (TG_OP = 'INSERT') then
    insert into public.point_history (user_id, memory_id, points, reason)
    select 
      m.user_id,
      new.memory_id,
      1,
      'Received a stamp on memory'
    from public.memories m
    where m.id = new.memory_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for memory stamps
create trigger on_memory_stamp
  after insert on public.memory_stamps
  for each row
  execute function handle_memory_stamp();