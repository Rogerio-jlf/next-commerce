'use client';
import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl') || undefined;

  const signInUrl = `/sign-in?redirectUrl=${redirectUrl}`;

  return (
    <section className='py-14'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center'>
          <SignUp signInUrl={signInUrl} redirectUrl={redirectUrl} />
        </div>
      </div>
    </section>
  );
}

