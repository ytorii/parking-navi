import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';

import AuthProvider from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const Home = lazy(() => import('@/pages/Home'));
const ParkingDetail = lazy(() => import('@/pages/ParkingDetail'));
const ParkingForm = lazy(() => import('@/pages/ParkingForm'));
const ReportForm = lazy(() => import('@/pages/ReportForm'));
const SeedPage = lazy(() => import('@/pages/SeedPage'));
const Explore = lazy(() => import('@/pages/Explore'));

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <p className="text-sm text-slate-400">読み込み中...</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="bottom-center" richColors theme="dark" />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/parking/new"
              element={
                <ProtectedRoute>
                  <ParkingForm />
                </ProtectedRoute>
              }
            />
            <Route path="/parking/:parkingLotId" element={<ParkingDetail />} />
            <Route
              path="/parking/:parkingLotId/edit"
              element={
                <ProtectedRoute>
                  <ParkingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/:parkingLotId"
              element={
                <ProtectedRoute>
                  <ReportForm />
                </ProtectedRoute>
              }
            />
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/admin/seed"
              element={
                <ProtectedRoute>
                  <SeedPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
