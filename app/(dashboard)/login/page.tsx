import LoginForm from '@/components/login-form';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <LoginForm />
    </div>
  );
}