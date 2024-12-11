import { AddPost } from "../components/society/AddPost";
import { useAuthContext } from "../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export function AddPostsPage() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate('/auth-screen');
    }
  }, [user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white">
      <AddPost/>
    </div>
  );
}
  
  