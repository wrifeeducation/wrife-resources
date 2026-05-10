// Tool catalogue moved to /dashboard to avoid route conflict with public landing page.
import { redirect } from 'next/navigation';

export default function AppRootRedirect() {
  redirect('/dashboard');
}
