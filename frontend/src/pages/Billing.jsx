import React, { useState } from 'react';
import { CreditCard, Plus, ShieldCheck, DollarSign, Calendar, FileText, Search, Download, CheckCircle, Clock } from 'lucide-react';
import './Billing.css';

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Mock billing data
  const [invoices, setInvoices] = useState([
    { id: "FAC-2026-001", patient: "Elena Rodríguez", date: "2026-06-24", amount: "$250.00", method: "Tarjeta de Crédito", insurance: "INS Medical (80%)", status: "Pagado" },
    { id: "FAC-2026-002", patient: "Roberto López", date: "2026-06-23", amount: "$450.00", method: "Pendiente", insurance: "Particular", status: "Pendiente" },
    { id: "FAC-2026-003", patient: "Sofía Martínez", date: "2026-06-20", amount: "$120.00", method: "Sinpe Móvil", insurance: "Particular", status: "Pagado" },
    { id: "FAC-2026-004", patient: "Guillermo Pérez", date: "2026-06-18", amount: "$1,200.00", method: "Transferencia", insurance: "Panamerican Life (70%)", status: "Pagado" }
  ]);

  const [insuranceProviders] = useState([
    { name: "INS Medical", activePolicies: 18, coverageAvg: "80%", contact: "soporte@insmedical.com" },
    { name: "Panamerican Life", activePolicies: 12, coverageAvg: "70%", contact: "claims@palig.com" },
    { name: "ASSA Seguros", activePolicies: 8, coverageAvg: "75%", contact: "salud@assa.com.cr" }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    patient: '',
    amount: '',
    insurance: 'Particular',
    status: 'Pendiente'
  });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newInvoice.patient || !newInvoice.amount) return;

    const invoice = {
      id: `FAC-2026-00${invoices.length + 1}`,
      patient: newInvoice.patient,
      date: new Date().toISOString().split('T')[0],
      amount: `$${parseFloat(newInvoice.amount).toFixed(2)}`,
      method: newInvoice.status === 'Pagado' ? 'Efectivo' : 'Pendiente',
      insurance: newInvoice.insurance,
      status: newInvoice.status
    };

    setInvoices([invoice, ...invoices]);
    setShowInvoiceModal(false);
    setNewInvoice({
      patient: '',
      amount: '',
      insurance: 'Particular',
      status: 'Pendiente'
    });
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    invoice.id.includes(searchTerm)
  );

  return (
    <div className="billing-view">
      <header className="billing-header animate-fade-in">
        <div>
          <h1>Facturación y Seguros</h1>
          <p className="subtitle">Administración de cobros, copagos y convenios de seguros odontológicos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowInvoiceModal(true)}>
          <Plus size={18} />
          <span>Generar Factura</span>
        </button>
      </header>

      {/* Financial Summary */}
      <div className="financial-summary-grid animate-fade-in">
        <div className="finance-card">
          <div className="finance-icon-box green">
            <DollarSign size={22} />
          </div>
          <div className="finance-info">
            <span className="finance-label">Ingresos Mensuales</span>
            <h3>$8,420.00</h3>
            <span className="finance-sub">+18.5% vs mes anterior</span>
          </div>
        </div>

        <div className="finance-card">
          <div className="finance-icon-box amber">
            <Clock size={22} />
          </div>
          <div className="finance-info">
            <span className="finance-label">Cuentas por Cobrar</span>
            <h3>$450.00</h3>
            <span className="finance-sub">1 factura pendiente</span>
          </div>
        </div>

        <div className="finance-card">
          <div className="finance-icon-box blue">
            <ShieldCheck size={22} />
          </div>
          <div className="finance-info">
            <span className="finance-label">Reclamaciones de Seguros</span>
            <h3>3 Activas</h3>
            <span className="finance-sub">Tasa de aprobación del 98%</span>
          </div>
        </div>
      </div>

      <div className="billing-main-grid animate-fade-in">
        {/* Left: Invoices list */}
        <div className="billing-card card bg-surface">
          <div className="card-header-actions">
            <h3>Facturas Recientes</h3>
            <div className="search-bar-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar por paciente o factura..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Paciente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Seguro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, idx) => (
                  <tr key={idx}>
                    <td><strong>{invoice.id}</strong></td>
                    <td>{invoice.patient}</td>
                    <td>{invoice.date}</td>
                    <td><strong className="invoice-amount">{invoice.amount}</strong></td>
                    <td>{invoice.method}</td>
                    <td><span className="insurance-pill">{invoice.insurance}</span></td>
                    <td>
                      <span className={`status-badge ${invoice.status.toLowerCase()}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-table-action" title="Descargar PDF">
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Insurance partnerships */}
        <div className="insurance-card card bg-surface">
          <h3>Aseguradoras Aliadas</h3>
          <p className="section-description">Gestión de convenios de reembolso y copagos autorizados en clínica.</p>
          <div className="insurance-list">
            {insuranceProviders.map((provider, idx) => (
              <div key={idx} className="insurance-item">
                <div className="insurance-header">
                  <h4>{provider.name}</h4>
                  <span className="coverage-badge">Coaseguro Medio: {provider.coverageAvg}</span>
                </div>
                <div className="insurance-details">
                  <p>Polizas activas: <strong>{provider.activePolicies} pacientes</strong></p>
                  <span className="insurance-email">{provider.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showInvoiceModal && (
        <div className="modal-backdrop">
          <div className="modal-content card animate-scale-up">
            <div className="modal-header">
              <h2>Generar Nueva Factura</h2>
              <button className="btn-close" onClick={() => setShowInvoiceModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nombre del Paciente *</label>
                  <input 
                    type="text" 
                    required 
                    value={newInvoice.patient}
                    onChange={(e) => setNewInvoice({ ...newInvoice, patient: e.target.value })}
                    placeholder="Ej. Roberto López"
                  />
                </div>
                <div className="form-group">
                  <label>Monto Total ($ USD) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required 
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    placeholder="Ej. 150.00"
                  />
                </div>
                <div className="form-group">
                  <label>Seguro / Coaseguro</label>
                  <select 
                    value={newInvoice.insurance}
                    onChange={(e) => setNewInvoice({ ...newInvoice, insurance: e.target.value })}
                  >
                    <option value="Particular">Particular (Sin Seguro)</option>
                    <option value="INS Medical (80%)">INS Medical (80%)</option>
                    <option value="Panamerican Life (70%)">Panamerican Life (70%)</option>
                    <option value="ASSA Seguros (75%)">ASSA Seguros (75%)</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Estado Inicial de la Factura</label>
                  <select 
                    value={newInvoice.status}
                    onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
                  >
                    <option value="Pendiente">Pendiente de Pago</option>
                    <option value="Pagado">Pagado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowInvoiceModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
