import { LoginForm } from '../components/auth/LoginForm';

export function Login() {
  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to Uni Connect</h1>
        <LoginForm />
      </div>
    </div>
  );
}

