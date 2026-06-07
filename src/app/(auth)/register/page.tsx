'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login?tab=signup');
  }, [router]);

  return (
    <main className='min-h-screen bg-white px-6 py-10'>
      <p className='text-sm text-neutral-900'>Opening sign up...</p>
    </main>
  );
}
