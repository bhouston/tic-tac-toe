import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the welcome page
  redirect('/welcome');
}
