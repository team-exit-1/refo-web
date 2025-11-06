import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LocationTracking from './pages/LocationTracking';
import SafeZoneSettings from './pages/SafeZoneSettings';
import TimeCapsuleList from './pages/TimeCapsuleList';
import TimeCapsuleCreate from './pages/TimeCapsuleCreate';
import TimeCapsuleDetail from './pages/TimeCapsuleDetail';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/location" element={<LocationTracking />} />
          <Route path="/location/safe-zone" element={<SafeZoneSettings />} />
          <Route path="/timecapsule" element={<TimeCapsuleList />} />
          <Route path="/timecapsule/create" element={<TimeCapsuleCreate />} />
          <Route path="/timecapsule/:id" element={<TimeCapsuleDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
