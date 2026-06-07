'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { login, register as registerUser } from '@/lib/api/auth';
import {
  LoginFormValues,
  RegisterFormValues,
  loginSchema,
  registerSchema,
} from '@/lib/validations/auth';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

type AuthTab = 'signin' | 'signup';

type ApiErrorResponse = {
  message?: string;
};

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const activeTab: AuthTab = tabFromUrl === 'signup' ? 'signup' : 'signin';

  const setAuth = useAuthStore((state) => state.setAuth);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      setAuth(data.token, data.user ?? null);
      toast.success('Login succeed');
      router.push('/');
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message ??
        'Login failed, Check email and password';

      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      setAuth(data.token, data.user ?? null);
      toast.success('Registration succeed');
      router.push('/');
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message ?? 'Registrasi gagal, coba lagi';

      toast.error(message);
    },
  });

  function handleTabChange(nextTab: AuthTab) {
    if (nextTab === 'signup') {
      router.replace('/login?tab=signup');
      return;
    }

    router.replace('/login');
  }

  function handleLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  function handleRegisterSubmit(values: RegisterFormValues) {
    registerMutation.mutate(values);
  }

  return (
    <main className='min-h-screen bg-white'>
      <div className='grid min-h-screen lg:grid-cols-2'>
        <section className='hidden lg:block'>
          <Image
            src='/images/login.png'
            alt='login images'
            width={900}
            height={900}
            priority
            className='h-full w-full object-cover'
          />
        </section>

        <section className='flex items-center justify-center px-6 pt-51 pb-57 xl:px-43 xl:py-68'>
          <div className='w-full max-w-md '>
            <div className='w-full mb-5'>
              <Image
                src='/images/logo.svg'
                alt='Logo'
                width={150}
                height={40}
                priority
                className='h-full w-28.5 object-cover mb-4'
              />
              <h1 className='font-extrabold text-2xl leading-9  text-neutral-950 lg:text-[28px] lg:leading-9.5'>
                Welcome Back
              </h1>
              <p className='font-medium text-sm leading-7 text-neutral-950 lg:text-base lg:leading-7.5 lg:tracking-[-3%]'>
                Good to see you again! Let’s eat
              </p>
            </div>

            <div className='mb-5 h-12 lg:h-14 grid grid-cols-2 rounded-md border bg-neutral-100 p-2 gap-2'>
              <button
                type='button'
                onClick={() => handleTabChange('signin')}
                className={`rounded-sm text-sm lg:text-base ${
                  activeTab === 'signin'
                    ? 'font-bold text-neutral-950  bg-white backdrop-blur-[20px] border-[#CBCACA]/25'
                    : 'font-medium text-neutral-600 bg-neutral-100'
                }`}
              >
                Sign In
              </button>

              <button
                type='button'
                onClick={() => handleTabChange('signup')}
                className={`rounded-xl text-sm leading-7 ${
                  activeTab === 'signup'
                    ? 'font-bold text-neutral-950  bg-white backdrop-blur-[20px] border-[#CBCACA]/25'
                    : 'font-medium text-neutral-600 bg-neutral-100'
                }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'signin' ? (
              <form
                onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                className='space-y-5'
              >
                <div className='relative bg-white border h-12 border-neutral-300 rounded-[10px] px-4 pt-5 pb-6 focus-within:border-neutral-400 transition-colors'>
                  <input
                    type='email'
                    id='login-email'
                    placeholder=' '
                    className='peer w-full text-sm font-medium text-neutral-950 bg-transparent border-none outline-none placeholder-transparent focus:ring-0 p-0'
                    autoComplete='email'
                    {...loginForm.register('email')}
                  />
                  <label
                    htmlFor='login-email'
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500'
                  >
                    Email
                  </label>
                  {registerForm.formState.errors.email ? (
                    <p className='text-sm text-primary-100'>
                      {registerForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className='relative bg-white border h-12 border-neutral-300 rounded-[10px] px-4 pt-5 pb-6 focus-within:border-neutral-400 transition-colors'>
                  <input
                    type='password'
                    id='login-password'
                    className='peer w-full text-sm font-medium text-neutral-950 bg-transparent border-none outline-none placeholder-transparent focus:ring-0 p-0'
                    autoComplete='current-password'
                    {...loginForm.register('password')}
                  />
                  <label
                    htmlFor='login-password'
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500'
                  >
                    Password
                  </label>
                  {loginForm.formState.errors.password ? (
                    <p className='text-sm text-red-600'>
                      {loginForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'processing...' : 'Login'}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className='space-y-5'
              >
                <div className='relative bg-white border h-12 border-neutral-300 rounded-[10px] px-4 pt-5 pb-6 focus-within:border-neutral-400 transition-colors'>
                  <input
                    type='text'
                    id='register-name'
                    className='peer w-full text-sm font-medium text-neutral-950 bg-transparent border-none outline-none placeholder-transparent focus:ring-0 p-0'
                    autoComplete='name'
                    {...registerForm.register('name')}
                  />
                  <label
                    htmlFor='register-name'
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500'
                  >
                    Name
                  </label>
                  {registerForm.formState.errors.name ? (
                    <p className='text-sm text-primary-100'>
                      {registerForm.formState.errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div className='relative bg-white border h-12 border-neutral-300 rounded-[10px] px-4 pt-5 pb-6 focus-within:border-neutral-400 transition-colors'>
                  <input
                    type='text'
                    id='register-email'
                    className='peer w-full text-sm font-medium text-neutral-950 bg-transparent border-none outline-none placeholder-transparent focus:ring-0 p-0'
                    autoComplete='email'
                    {...registerForm.register('email')}
                  />
                  <label
                    htmlFor='register-email'
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500'
                  >
                    Email
                  </label>
                  {registerForm.formState.errors.email ? (
                    <p className='text-sm text-primary-100'>
                      {registerForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className='relative bg-white border h-12 border-neutral-300 rounded-[10px] px-4 pt-5 pb-6 focus-within:border-neutral-400 transition-colors'>
                  <input
                    type='text'
                    id='register-phone'
                    placeholder=' '
                    className='peer w-full text-sm font-medium text-neutral-950 bg-transparent border-none outline-none placeholder-transparent focus:ring-0 p-0'
                    autoComplete='tel'
                    {...registerForm.register('phone')}
                  />
                  <label
                    htmlFor='register-phone'
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500'
                  >
                    Number Phone
                  </label>

                  {registerForm.formState.errors.phone ? (
                    <p className='text-sm text-primary-100'>
                      {registerForm.formState.errors.phone.message}
                    </p>
                  ) : null}
                </div>

                <div className='relative bg-white border h-12 border-neutral-300 rounded-[10px] px-4 pt-5 pb-6 focus-within:border-neutral-400 transition-colors'>
                  <input
                    type='password'
                    id='register-password'
                    className='peer w-full text-sm font-medium text-neutral-950 bg-transparent border-none outline-none placeholder-transparent focus:ring-0 p-0'
                    autoComplete='new-password'
                    {...registerForm.register('password')}
                  />
                  <label
                    htmlFor='register-password'
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm transition-all duration-200 pointer-events-none peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-neutral-500 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-neutral-500'
                  >
                    Password
                  </label>
                  {registerForm.formState.errors.password ? (
                    <p className='text-sm text-primary-100'>
                      {registerForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>

                <Button
                  type='submit'
                  className='w-full'
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'processing...' : 'Register'}
                </Button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen bg-white px-6 py-10'>
          <p className='text-sm text-zinc-600'>Memuat halaman auth...</p>
        </main>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
