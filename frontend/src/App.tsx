import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const LandingPage   = lazy(() => import('./pages/LandingPage'));
const Manifesto     = lazy(() => import('./pages/Manifesto'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const MemberDashboard  = lazy(() => import('./pages/MemberDashboard'));
const SOSPage       = lazy(() => import('./pages/SOS'));
const SilentButton  = lazy(() => import('./components/SilentButton'));

function App() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: '#0F2027' }}>Carregando...</div>}>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/assine"    element={<SubscriptionPage />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/sos"       element={<SOSPage />} />
        </Routes>
        {location.pathname !== '/sos' && <SilentButton />}
      </Suspense>
    </div>
  );
}

export default App;
