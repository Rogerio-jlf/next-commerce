'use client';
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl') || undefined;

  const signUpUrl = `/sign-up?redirectUrl=${redirectUrl}`;

  return (
    <section className='py-14'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-center'>
          <SignIn signUpUrl={signUpUrl} redirectUrl={redirectUrl} />
        </div>
      </div>
    </section>
  );
}






