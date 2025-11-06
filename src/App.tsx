import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ElderRegistration from './pages/ElderRegistration';
import Dashboard from './pages/Dashboard';
import LocationTracking from './pages/LocationTracking';
import SafeZoneSettings from './pages/SafeZoneSettings';
import TimeCapsuleList from './pages/TimeCapsuleList';
import TimeCapsuleCreate from './pages/TimeCapsuleCreate';
import TimeCapsuleDetail from './pages/TimeCapsuleDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 어르신 등록 페이지 (레이아웃 없음) */}
        <Route path="/" element={<ElderRegistration />} />
        
        {/* 나머지 페이지들 (레이아웃 포함) */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/location" element={<LocationTracking />} />
              <Route path="/location/safe-zone" element={<SafeZoneSettings />} />
              <Route path="/timecapsule" element={<TimeCapsuleList />} />
              <Route path="/timecapsule/create" element={<TimeCapsuleCreate />} />
              <Route path="/timecapsule/:id" element={<TimeCapsuleDetail />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
