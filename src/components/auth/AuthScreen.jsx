import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export function AuthScreen(){

    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#1A1A1D]">
          <div className="bg-[#1A1A1D] p-6 rounded-lg shadow-lg text-center border border-[#6A1E55]">
            <h2 className="text-xl font-bold mb-4 text-white">Welcome to the Dashboard</h2>
            <p className="mb-4 text-white">Please log in or sign up to access your dashboard.</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      );
    }