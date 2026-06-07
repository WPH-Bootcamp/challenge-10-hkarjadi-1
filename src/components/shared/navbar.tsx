'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/lib/query/auth';

export function Navbar() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { data: profile } = useProfile(hasHydrated && Boolean(token));

  const displayName = profile?.name ?? user?.name ?? 'User';

  const avatarUrl = profile?.avatar;

  function handleLogout() {
    clearAuth();

    // to main pages
    router.push('/');
  }

  return (
    <section className='absolute top-0 mt-3 bg-white/0 w-full z-10 px-4'>
      {!hasHydrated ? null : token ? (
        <nav className='flex flex-row justify-between items-center h-full'>
          <Image
            src='/images/logo3.svg'
            alt='Company Logo'
            width={40}
            height={40}
            priority
            className='object-cover block md:hidden'
          />
          <Image
            src='/images/logo2.svg'
            alt='Company Logo'
            width={150}
            height={40}
            priority
            className='object-cover hidden md:block'
          />
          <div className='flex flex-justify items-center gap-2'>
            <Link href='/cart'>
              <Button variant='third'>
                <ShoppingCart className=' mr-2 h-4 w-4' />
              </Button>
            </Link>

            <div className='flex gap-4 justify-center items-center'>
              <div className='relative w-8 h-8 rounded-full overflow-hidden border border-gray-200'>
                <Image
                  src={avatarUrl || `/images/avatar.svg`}
                  alt='Profile Photo'
                  fill
                  className='object-cover'
                />
              </div>
              <p className='hidden text-base text-white md:text-xl font-extrabold md:block [text-shadow:0_0_5px_rgba(0,0,0,1)]'>
                {displayName || 'User'}
              </p>
            </div>

            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </nav>
      ) : (
        <nav className='flex flex-row justify-between items-center h-full'>
          <Image
            src='/images/logo3.svg'
            alt='Company Logo'
            width={40}
            height={40}
            priority
            className='object-cover block md:hidden'
          />
          <Image
            src='/images/logo2.svg'
            alt='Company Logo'
            width={150}
            height={40}
            priority
            className='object-cover hidden md:block'
          />
          <div>
            <Link href='/login'>
              <Button
                variant='outline'
                className='mr-4 py-2 px-2 md:px-6 lg:px-14'
              >
                Sign In
              </Button>
            </Link>

            <Link href='/register'>
              <Button
                variant='secondary'
                className='py-2 px-2 md:px-6 lg:px-14'
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </section>
  );
}

export default Navbar;
