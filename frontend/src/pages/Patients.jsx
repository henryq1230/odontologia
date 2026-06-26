import React, { useState } from 'react';
import { Search, Plus, User, FileText, Phone, Mail, Heart, Calendar, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import './Patients.css';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock initial patients list
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Elena Rodríguez",
      age: 34,
      docId: "1-1425-0632",
      phone: "+506 8877-6655",
      email: "elena.rodriguez@email.com",
      bloodType: "O+",
      allergies: "Penicilina",
      history: "Ninguna condición crónica importante. Higiene bucal óptima.",
      lastVisit: "2026-06-24",
      status: "Activo",
      treatments: [
        { date: "2026-06-24", name: "Tratamiento de Canales", status: "Completado", cost: "$250" },
        { date: "2026-05-12", name: "Profilaxis Completa", status: "Completado", cost: "$60" }
      ]
    },
    {
      id: 2,
      name: "Roberto López",
      age: 45,
      docId: "3-0255-0814",
      phone: "+506 7011-2233",
      email: "roberto.lopez@email.com",
      bloodType: "A+",
      allergies: "Ninguna",
      history: "Hipertensión controlada. Fumador ocasional.",
      lastVisit: "2026-06-23",
      status: "Activo",
      treatments: [
        { date: "2026-06-23", name: "Corona de Porcelana (Diente 11)", status: "En Proceso", cost: "$450" }
      ]
    },
    {
      id: 3,
      name: "Sofía Martínez",
      age: 28,
      docId: "2-0789-0123",
      phone: "+506 8344-5566",
      email: "sofia.martinez@email.com",
      bloodType: "O-",
      allergies: "Látex",
      history: "Paciente con sensibilidad dental aguda en molares inferiores.",
      lastVisit: "2026-06-20",
      status: "Activo",
      treatments: [
        { date: "2026-06-20", name: "Profilaxis y Resina", status: "Completado", cost: "$120" }
      ]
    },
    {
      id: 4,
      name: "Guillermo Pérez",
      age: 52,
      docId: "1-0543-0987",
      phone: "+506 6122-3344",
      email: "guillermo.perez@email.com",
      bloodType: "B+",
      allergies: "Ninguna",
      history: "Diabetes Tipo 2 controlada.",
      lastVisit: "2026-06-18",
      status: "Inactivo",
      treatments: [
        { date: "2026-06-18", name: "Implante Dental (Fase 1)", status: "En Proceso", cost: "$1200" }
      ]
    }
  ]);

  // Form state for new patient
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    docId: '',
    phone: '',
    email: '',
    bloodType: 'O+',
    allergies: '',
    history: '',
    status: 'Activo'
  });

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name) return;
    
    const createdPatient = {
      ...newPatient,
      id: patients.length + 1,
      age: parseInt(newPatient.age) || 30,
      lastVisit: new Date().toISOString().split('T')[0],
      treatments: []
    };

    setPatients([createdPatient, ...patients]);
    setSelectedPatient(createdPatient);
    setShowAddModal(false);
    setNewPatient({
      name: '',
      age: '',
      docId: '',
      phone: '',
      email: '',
      bloodType: 'O+',
      allergies: '',
      history: '',
      status: 'Activo'
    });
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.docId.includes(searchTerm)
  );

  return (
    <div className="patients-view">
      <header className="patients-header animate-fade-in">
        <div>
          <h1>Fichas Clínicas de Pacientes</h1>
          <p className="subtitle">Gestión unificada de expedientes, odontograma e historial de tratamientos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          <span>Registrar Paciente</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="patients-grid animate-fade-in">
        {/* Left Side: Patients List */}
        <div className="patients-list-card card bg-surface">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="patients-list">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <div 
                  key={patient.id} 
                  className={`patient-list-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="patient-avatar-mini">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="patient-summary-info">
                    <h4>{patient.name}</h4>
                    <span className="patient-subtext">Cédula: {patient.docId} • {patient.age} años</span>
                  </div>
                  <div className="patient-status-badge">
                    <span className={`status-pill ${patient.status.toLowerCase()}`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No se encontraron pacientes que coincidan con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed Patient File */}
        <div className="patient-detail-card card bg-surface">
          {selectedPatient ? (
            <div className="patient-details">
              <div className="patient-detail-header">
                <div className="patient-avatar-large">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div className="patient-title-info">
                  <h2>{selectedPatient.name}</h2>
                  <span className="patient-detail-id">ID Expediente: #000{selectedPatient.id} • Cédula: {selectedPatient.docId}</span>
                </div>
              </div>

              <div className="info-tabs">
                <div className="info-tab-section">
                  <h3>Información de Contacto</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <Phone size={16} />
                      <div>
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">{selectedPatient.phone}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <Mail size={16} />
                      <div>
                        <span className="info-label">Correo Electrónico</span>
                        <span className="info-value">{selectedPatient.email}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <Calendar size={16} />
                      <div>
                        <span className="info-label">Última Consulta</span>
                        <span className="info-value">{selectedPatient.lastVisit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-tab-section">
                  <h3>Información Médica</h3>
                  <div className="medical-banner">
                    <div className="medical-badge">
                      <Heart size={18} className="text-danger" />
                      <span>Tipo de Sangre: <strong>{selectedPatient.bloodType}</strong></span>
                    </div>
                    {selectedPatient.allergies !== "Ninguna" && (
                      <div className="medical-badge alert">
                        <ShieldAlert size={18} className="text-warning" />
                        <span>Alergias: <strong className="text-warning">{selectedPatient.allergies}</strong></span>
                      </div>
                    )}
                  </div>
                  <div className="history-text">
                    <strong>Antecedentes Clínicos:</strong>
                    <p>{selectedPatient.history}</p>
                  </div>
                </div>

                <div className="info-tab-section">
                  <h3>Historial de Tratamientos</h3>
                  {selectedPatient.treatments.length > 0 ? (
                    <div className="treatments-timeline">
                      {selectedPatient.treatments.map((treatment, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <h4>{treatment.name}</h4>
                              <span className="treatment-cost">{treatment.cost}</span>
                            </div>
                            <div className="timeline-footer">
                              <span className="treatment-date">{treatment.date}</span>
                              <span className={`status-badge ${treatment.status.toLowerCase().replace(/ /g, '-')}`}>
                                {treatment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-treatments">No hay tratamientos registrados para este paciente.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-patient-selected">
              <User size={64} className="text-muted" />
              <h3>Selecciona un Paciente</h3>
              <p>Elige un paciente de la lista para ver su expediente dental completo, tratamientos y alertas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content card animate-scale-up">
            <div className="modal-header">
              <h2>Registrar Nuevo Paciente</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddPatient}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    placeholder="Ej. Ana María Castro"
                  />
                </div>
                <div className="form-group">
                  <label>Edad</label>
                  <input
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    placeholder="Ej. 28"
                  />
                </div>
                <div className="form-group">
                  <label>Identificación / Cédula</label>
                  <input
                    type="text"
                    value={newPatient.docId}
                    onChange={(e) => setNewPatient({ ...newPatient, docId: e.target.value })}
                    placeholder="Ej. 1-0987-0654"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="Ej. +506 8888-9999"
                  />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="Ej. ana.castro@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Sangre</label>
                  <select
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Alergias</label>
                  <input
                    type="text"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    placeholder="Ej. Penicilina, Látex (o 'Ninguna')"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Antecedentes Clínicos</label>
                  <textarea
                    value={newPatient.history}
                    onChange={(e) => setNewPatient({ ...newPatient, history: e.target.value })}
                    placeholder="Detalles sobre afecciones crónicas, medicamentos actuales, etc."
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
