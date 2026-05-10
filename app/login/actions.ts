'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard';

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent('Please enter your email and password.')}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent('Invalid email or password.')}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  redirect(redirectTo);
}
