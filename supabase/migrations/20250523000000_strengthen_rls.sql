-- Ensure RLS is enabled on listings
alter table listings enable row level security;

-- Create a specific policy for INSERT operations that explicitly checks for authentication
-- Note: The existing "Users can insert their own listings" policy (checking auth.uid() = user_id)
-- implicitly requires authentication, but this adds an explicit layer as requested.
-- We use a new name to avoid conflict.

create policy "Authenticated users can insert listings"
  on listings for insert
  with check (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id
  );
