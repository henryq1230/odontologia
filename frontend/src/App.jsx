import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Login from './pages/Login';
import ClinicLayout from './components/ClinicLayout';
import ClinicDashboard from './pages/ClinicDashboard';
import Odontogram from './pages/Odontogram';
import DiagnosticsIA from './pages/DiagnosticsIA';
import Patients from './pages/Patients';
import Billing from './pages/Billing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/login" element={<Login />} />
        
        {/* Clinic Workspace Portal */}
        <Route path="/" element={<ClinicLayout />}>
          <Route path="dashboard" element={<ClinicDashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="odontogram" element={<Odontogram />} />
          <Route path="diagnostics" element={<DiagnosticsIA />} />
          <Route path="billing" element={<Billing />} />
        </Route>
        
        <Route path="/payment-success" element={
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <h1 style={{ color: '#00327d', marginBottom: '1rem' }}>¡Gracias por tu pago!</h1>
            <p>Estamos aprovisionando la base de datos y DNS para tu clínica. Por favor espera unos minutos...</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
