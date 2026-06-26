import React from 'react';
import { Users, Calendar, Beaker, TrendingUp, AlertTriangle, Eye } from 'lucide-react';
import './ClinicDashboard.css';

export default function ClinicDashboard() {
  const stats = [
    { title: "Pacientes Activos", value: "1,248", icon: <Users size={20} />, change: "+12% este mes", color: "blue" },
    { title: "Citas de Hoy", value: "14", icon: <Calendar size={20} />, change: "3 asistidas por IA", color: "amber" },
    { title: "Lab Pendiente", value: "5", icon: <Beaker size={20} />, change: "2 requieren atención", color: "red" },
    { title: "Facturación Mensual", value: "$8,420", icon: <TrendingUp size={20} />, change: "+18% vs mes anterior", color: "green" }
  ];

  const recentPatients = [
    { id: 1, name: "Elena Rodríguez", age: 34, lastVisit: "2026-06-24", treatment: "Tratamiento de Canales", status: "Completado" },
    { id: 2, name: "Roberto López", age: 45, lastVisit: "2026-06-23", treatment: "Corona Porcelana", status: "Pendiente Laboratorio" },
    { id: 3, name: "Sofía Martínez", age: 28, lastVisit: "2026-06-20", treatment: "Profilaxis y Resina", status: "Completado" },
    { id: 4, name: "Guillermo Pérez", age: 52, lastVisit: "2026-06-18", treatment: "Implante Dental", status: "En Proceso" }
  ];

  return (
    <div className="clinic-dashboard-view">
      {/* Stats Row */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon-wrapper ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-title">{stat.title}</span>
              <h2 className="stat-value">{stat.value}</h2>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Citas y Laboratorio */}
      <div className="dashboard-main-grid">
        {/* Lab alerts */}
        <div className="dashboard-section alerts-section">
          <div className="section-title-container">
            <AlertTriangle size={18} className="text-accent" />
            <h3>Alertas de Laboratorio Dental</h3>
          </div>
          <div className="alerts-list">
            <div className="alert-item warning">
              <div className="alert-dot"></div>
              <div className="alert-content">
                <strong>Corona Porcelana - Roberto López</strong>
                <p>Laboratorio reporta retraso de entrega de 1 día (Diente 11).</p>
              </div>
              <span className="alert-time">Hace 2 horas</span>
            </div>
            <div className="alert-item info">
              <div className="alert-dot"></div>
              <div className="alert-content">
                <strong>Prótesis Parcial - Guillermo Pérez</strong>
                <p>Enviado a laboratorio dental Central S.A. para vaciado.</p>
              </div>
              <span className="alert-time">Ayer</span>
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="dashboard-section patients-section">
          <h3>Pacientes Recientes</h3>
          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Edad</th>
                  <th>Última Visita</th>
                  <th>Tratamiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map(patient => (
                  <tr key={patient.id}>
                    <td><strong>{patient.name}</strong></td>
                    <td>{patient.age} años</td>
                    <td>{patient.lastVisit}</td>
                    <td>{patient.treatment}</td>
                    <td>
                      <span className={`status-badge ${patient.status.toLowerCase().replace(/ /g, '-')}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-table-action" title="Ver Expediente">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
