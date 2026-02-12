create table if not exists listings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  category text not null,
  location text not null,
  images text[] default array[]::text[],
  user_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('active', 'sold', 'expired', 'paused', 'deleted')) default 'active',
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table listings enable row level security;

-- Policies
create policy "Public listings are viewable by everyone"
  on listings for select
  using ( status = 'active' );

create policy "Users can insert their own listings"
  on listings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own listings"
  on listings for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own listings"
  on listings for delete
  using ( auth.uid() = user_id );

-- Indexes
create index listings_user_id_idx on listings (user_id);
create index listings_category_idx on listings (category);
create index listings_created_at_idx on listings (created_at desc);

-- Trigger
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
