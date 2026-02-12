insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'listing-images' );

create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'listing-images'
  and auth.role() = 'authenticated'
);
