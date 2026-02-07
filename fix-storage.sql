-- Drop the restrictive policy
DROP POLICY IF EXISTS "Allow Authenticated Uploads" ON storage.objects;

-- Create a new policy that allows anyone (including anonymous) to upload
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'proof-of-payment' );

-- Also allow authenticated users
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'proof-of-payment' );

-- Allow anyone to view files
CREATE POLICY "Allow public view"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'proof-of-payment' );

