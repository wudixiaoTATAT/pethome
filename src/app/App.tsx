import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/home-page';
import { AnimalDetailPage } from './components/animal-detail-page';
import { AuthPage } from './components/auth-page';
import { ProfilePage } from './components/profile-page';
import { SetupGuidePage } from './components/setup-guide-page';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from 'sonner';

function AppRoutes() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animal/:id" element={<AnimalDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/setup-guide" element={<SetupGuidePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}