import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, HeartHandshake, BrainCircuit, Activity, Receipt, LogOut } from 'lucide-react';
import './ClinicLayout.css';

export default function ClinicLayout() {
  const navigate = useNavigate();
  const subdomain = window.location.hostname.split('.')[0];
  const userEmail = localStorage.getItem('user_email') || 'doctor@odontologia.ai';

  // For testing, mock plan modules. In production, this comes from the active tenant settings.
  // Full module list: ["smart_intake", "citas_ia", "odontograma", "diagnostico_ia", "inventario", "facturacion", "marketing"]
  const enabledModules = ["smart_intake", "odontograma", "citas_ia", "facturacion", "diagnostico_ia"]; 

  const isModuleEnabled = (moduleName) => {
    return enabledModules.includes(moduleName);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="clinic-layout">
      {/* Sidebar Navigation */}
      <aside className="clinic-sidebar">
        <div className="sidebar-brand">
          <h2>Odontolog<span className="logo-highlight">IA</span></h2>
          <span className="tenant-tag">{subdomain.toUpperCase() || 'CLINIC'}</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/patients" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>Pacientes</span>
          </NavLink>

          {isModuleEnabled('odontograma') && (
            <NavLink to="/odontogram" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Activity size={18} />
              <span>Odontograma FDI</span>
            </NavLink>
          )}

          {isModuleEnabled('diagnostico_ia') && (
            <NavLink to="/diagnostics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BrainCircuit size={18} />
              <span>Diagnóstico IA</span>
            </NavLink>
          )}

          {isModuleEnabled('facturacion') && (
            <NavLink to="/billing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Receipt size={18} />
              <span>Facturación</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">{userEmail[0].toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">Dr. Profesional</span>
              <span className="user-role">Dentista</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout" title="Cerrar Sesión">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="clinic-main-panel">
        <header className="clinic-top-bar">
          <div className="clinic-status">
            <div className="status-indicator">
              <span className="dot online"></span>
              <span>Asistente de IA OdontologIA conectado</span>
            </div>
          </div>
          <div className="clinic-meta">
            <span className="plan-pill">Plan Premium</span>
          </div>
        </header>

        <div className="clinic-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
