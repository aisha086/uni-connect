import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ResetPassword } from './pages/ResetPassword';
import { Society } from './pages/Society';
import { CreateSociety } from './components/dashboard/CreateSociety';
import { ApplicationStatus } from './components/dashboard/ApplicationStatus';
import { MembershipRequestStatus } from './components/dashboard/MembershipRequestStatus';
import { CreateEventPage } from './pages/CreateEventPage';
import { AddOpenPositionPage } from './pages/AddOpenPositionPage';
import { AddPostsPage } from './pages/AddPostsPage';
import { AuthScreen } from './components/auth/AuthScreen';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth-screen" element={<AuthScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/society/:societyId" element={<Society />} />
          <Route path="/society/:societyId/create-event" element={<CreateEventPage />} />
          <Route path="/society/:societyId/add-post" element={<AddPostsPage />} />
          <Route path="/society/:societyId/add-position" element={<AddOpenPositionPage />} />
          <Route path="/create-society" element={<CreateSociety />} />
          <Route path="/application-status" element={<ApplicationStatus />} />
          <Route path="/membership-requests" element={<MembershipRequestStatus />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

