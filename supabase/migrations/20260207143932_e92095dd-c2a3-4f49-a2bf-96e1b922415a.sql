-- Fix the contact submissions policy to validate required fields
DROP POLICY "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form with valid data"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (
    name IS NOT NULL AND 
    LENGTH(TRIM(name)) > 0 AND 
    LENGTH(name) <= 100 AND
    email IS NOT NULL AND 
    LENGTH(TRIM(email)) > 0 AND 
    LENGTH(email) <= 255 AND
    email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
    message IS NOT NULL AND 
    LENGTH(TRIM(message)) > 0 AND 
    LENGTH(message) <= 1000
  );

-- Fix the notifications policy - notifications should only be created by triggers (SECURITY DEFINER functions)
DROP POLICY "System can create notifications" ON public.notifications;
-- Admins can create notifications manually if needed
CREATE POLICY "Admins can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));