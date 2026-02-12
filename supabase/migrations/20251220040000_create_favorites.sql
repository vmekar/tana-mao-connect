-- Favorites table
create table if not exists favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  listing_id uuid references listings(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, listing_id)
);

-- Enable RLS for favorites
alter table favorites enable row level security;

-- Policies for favorites
drop policy if exists "Users can insert their own favorites" on favorites;
create policy "Users can insert their own favorites"
  on favorites for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can view their own favorites" on favorites;
create policy "Users can view their own favorites"
  on favorites for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own favorites" on favorites;
create policy "Users can delete their own favorites"
  on favorites for delete
  using ( auth.uid() = user_id );

-- Indexes
create index if not exists favorites_user_id_idx on favorites (user_id);
create index if not exists favorites_listing_id_idx on favorites (listing_id);