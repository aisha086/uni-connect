import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export function ResetPassword() {
  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

