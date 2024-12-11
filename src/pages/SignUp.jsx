import { SignUpForm } from '../components/auth/SignUpForm';

export function SignUp() {
  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up for Uni Connect</h1>
        <SignUpForm />
      </div>
    </div>
  );
}

