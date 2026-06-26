import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Shield, LayoutGrid, DollarSign, ExternalLink, Trash2, CheckCircle } from 'lucide-react';
import './SuperAdminDashboard.css';

export default function SuperAdminDashboard() {
  const [plans, setPlans] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'tenants'

  // Modal / Form state for Plan creation/editing
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'MONTHLY',
    description: '',
    tilopay_link: '',
    modules: []
  });

  const availableModules = [
    { id: 'smart_intake', name: 'Portal de Admisión Inteligente' },
    { id: 'citas_ia', name: 'Cuaderno de Citas IA' },
    { id: 'odontograma', name: 'Odontograma FDI Interactivo' },
    { id: 'diagnostico_ia', name: 'Diagnóstico Clínico con IA' },
    { id: 'inventario', name: 'Control de Inventario y Suministros' },
    { id: 'facturacion', name: 'Gestión de Facturación y Seguros' },
    { id: 'marketing', name: 'Marketing y Fidelización' }
  ];

  useEffect(() => {
    // Load plans and tenants from backend
    Promise.all([
      fetch('http://localhost:8000/api/tenants/plans/').then(res => res.json()).catch(() => []),
      // Fallback for tenants when offline
      Promise.resolve([
        { id: 1, name: "Clínica Dental San José", subdomain: "sanjose", plan_name: "Plan Profesional", owner_name: "Dr. Carlos Gómez", owner_email: "carlos@sanjose.com", is_active: true },
        { id: 2, name: "DentalFlow IA Premium", subdomain: "flowpremium", plan_name: "Premium Dental Suite", owner_name: "Dra. Elena Ruiz", owner_email: "elena@flow.com", is_active: true }
      ])
    ]).then(([plansData, tenantsData]) => {
      setPlans(plansData.length ? plansData : [
        { id: 1, name: "Plan Básico", price: "49.00", frequency: "MONTHLY", description: "Esencial para consultas dentales individuales.", tilopay_link: "https://tilopay.me/checkout/plan-basico", modules: ["smart_intake", "odontograma"], is_active: true },
        { id: 2, name: "Plan Profesional", price: "99.00", frequency: "MONTHLY", description: "Para clínicas en crecimiento.", tilopay_link: "https://tilopay.me/checkout/plan-profesional", modules: ["smart_intake", "odontograma", "citas_ia", "facturacion"], is_active: true }
      ]);
      setTenants(tenantsData);
      setLoading(false);
    });
  }, []);

  const handleModuleToggle = (moduleId) => {
    setFormData(prev => {
      const isSelected = prev.modules.includes(moduleId);
      const newModules = isSelected
        ? prev.modules.filter(id => id !== moduleId)
        : [...prev.modules, moduleId];
      return { ...prev, modules: newModules };
    });
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      frequency: 'MONTHLY',
      description: '',
      tilopay_link: '',
      modules: []
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingPlan) {
      // Edit mode
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...formData } : p));
    } else {
      // Create mode
      const newPlan = {
        id: Date.now(),
        ...formData,
        is_active: true
      };
      setPlans(prev => [...prev, newPlan]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h2>Odontolog<span className="logo-highlight">IA</span></h2>
          <span className="badge-admin">SuperAdmin</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>
            <LayoutGrid size={18} />
            <span>Gestionar Planes</span>
          </button>
          <button className={`nav-item ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>
            <Shield size={18} />
            <span>Clínicas Activas (Tenants)</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'plans' ? 'Suscripciones y Planes' : 'Control de Clínicas Odontológicas'}</h1>
          {activeTab === 'plans' && (
            <button className="btn btn-primary btn-icon" onClick={openCreateModal}>
              <Plus size={16} /> Nuevo Plan
            </button>
          )}
        </header>

        {loading ? (
          <div className="loading-state">Cargando datos del panel administrativo...</div>
        ) : (
          <div className="dashboard-content animate-fade-in">
            {activeTab === 'plans' ? (
              <div className="plans-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Precio / Frecuencia</th>
                      <th>Módulos Habilitados</th>
                      <th>TiloPay Checkout</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(plan => (
                      <tr key={plan.id}>
                        <td>
                          <div className="plan-name-cell">
                            <strong>{plan.name}</strong>
                            <span>{plan.description}</span>
                          </div>
                        </td>
                        <td>
                          <div className="price-cell">
                            <span className="price-amt">${parseFloat(plan.price).toFixed(2)}</span>
                            <span className="price-freq">/ {plan.frequency === 'MONTHLY' ? 'Mes' : 'Año'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="modules-cell">
                            {plan.modules.map(mod => (
                              <span key={mod} className="module-tag">{mod.replace('_', ' ')}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          {plan.tilopay_link ? (
                            <a href={plan.tilopay_link} target="_blank" rel="noopener noreferrer" className="link-cell">
                              Checkout Link <ExternalLink size={12} />
                            </a>
                          ) : <span className="no-link">Sin configurar</span>}
                        </td>
                        <td>
                          <span className={`status-pill ${plan.is_active ? 'active' : 'inactive'}`}>
                            {plan.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-icon-only text-primary" onClick={() => {
                              setEditingPlan(plan);
                              setFormData({ ...plan });
                              setShowModal(true);
                            }}><Edit2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="tenants-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre de la Clínica</th>
                      <th>Subdominio asignado</th>
                      <th>Propietario / Email</th>
                      <th>Plan Contratado</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map(tenant => (
                      <tr key={tenant.id}>
                        <td><strong>{tenant.name}</strong></td>
                        <td><span className="subdomain-text">{tenant.subdomain}.odontologia.ai</span></td>
                        <td>
                          <div className="owner-cell">
                            <span>{tenant.owner_name}</span>
                            <span className="owner-email">{tenant.owner_email}</span>
                          </div>
                        </td>
                        <td><span className="plan-badge">{tenant.plan_name}</span></td>
                        <td>
                          <span className="status-pill active">Activa</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Plan Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingPlan ? 'Editar Plan de Suscripción' : 'Crear Nuevo Plan de Suscripción'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Nombre del Plan</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio (USD)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Frecuencia</label>
                  <select value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })}>
                    <option value="MONTHLY">Mensual</option>
                    <option value="ANNUALLY">Anual</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Enlace de Pago de TiloPay</label>
                <input type="url" value={formData.tilopay_link} onChange={e => setFormData({ ...formData, tilopay_link: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Módulos a Habilitar</label>
                <div className="modules-checkbox-grid">
                  {availableModules.map(mod => (
                    <label key={mod.id} className="checkbox-label">
                      <input type="checkbox" checked={formData.modules.includes(mod.id)} onChange={() => handleModuleToggle(mod.id)} />
                      <span>{mod.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingPlan ? 'Guardar Cambios' : 'Crear Plan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
