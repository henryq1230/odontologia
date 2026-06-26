import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Calendar, Clipboard, FileText, ChevronRight, Check } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch plans from dynamic django API
    fetch('http://localhost:8000/api/tenants/plans/')
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar los planes de suscripción');
        return res.json();
      })
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // Fallback pricing data for local development or disconnected state
        setPlans([
          {
            id: 1,
            name: "Plan Básico",
            price: "49.00",
            frequency: "MONTHLY",
            description: "Esencial para consultas dentales individuales y consultorios independientes.",
            tilopay_link: "https://tilopay.me/checkout/plan-basico",
            modules: ["smart_intake", "odontograma"],
          },
          {
            id: 2,
            name: "Plan Profesional",
            price: "99.00",
            frequency: "MONTHLY",
            description: "Para clínicas en crecimiento que requieren asistentes inteligentes y control completo.",
            tilopay_link: "https://tilopay.me/checkout/plan-profesional",
            modules: ["smart_intake", "odontograma", "citas_ia", "facturacion"],
          },
          {
            id: 3,
            name: "Premium Dental Suite",
            price: "199.00",
            frequency: "MONTHLY",
            description: "Todo el poder de la inteligencia artificial para diagnósticos radiológicos avanzados.",
            tilopay_link: "https://tilopay.me/checkout/plan-premium",
            modules: ["smart_intake", "odontograma", "citas_ia", "facturacion", "diagnostico_ia", "inventario", "marketing"],
          }
        ]);
        setLoading(false);
      });
  }, []);

  const getModuleName = (key) => {
    const names = {
      smart_intake: "Portal de Admisión Inteligente",
      citas_ia: "Cuaderno de Citas con IA",
      odontograma: "Odontograma FDI Interactivo",
      diagnostico_ia: "Diagnóstico Clínico Asistido por IA",
      inventario: "Control de Suministros e Inventario",
      facturacion: "Gestión de Facturas y Seguros",
      marketing: "Campañas de Fidelización",
    };
    return names[key] || key;
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="container nav-container">
          <div className="logo">
            <span className="logo-text">Odontolog<span className="logo-highlight">IA</span></span>
          </div>
          <nav className="nav-links">
            <a href="#features">Características</a>
            <a href="#pricing">Planes y Precios</a>
            <a href="http://localhost:5173/login" className="btn btn-outline btn-sm">Iniciar Sesión</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content animate-fade-in">
            <div className="badge">
              <Sparkles size={16} className="text-accent" />
              <span>Diagnóstico Inteligente con IA Dental</span>
            </div>
            <h1>La evolución digital de tu clínica dental</h1>
            <p>
              Gestiona expedientes, optimiza citas con inteligencia artificial, diseña odontogramas interactivos y ofrece diagnósticos precisos basados en análisis de radiografías en tiempo real.
            </p>
            <div className="hero-actions">
              <a href="#pricing" className="btn btn-primary">
                Ver Planes <ChevronRight size={16} />
              </a>
              <a href="#features" className="btn btn-secondary">Conocer Más</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card">
              <div className="chart-header">
                <h3>Asistente Clínico OdontologIA</h3>
                <span className="pulse-dot"></span>
              </div>
              <div className="chart-body">
                <div className="analysis-item">
                  <div className="analysis-icon"><Shield size={20} /></div>
                  <div className="analysis-details">
                    <h4>Análisis de Radiografía Dental</h4>
                    <p>IA detectó posible caries oclusal en diente 46 (78% de certeza)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Tecnología Avanzada para Profesionales Clínicos</h2>
            <p>Módulos integrados y diseñados exclusivamente para reducir la carga cognitiva del odontólogo.</p>
          </div>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon"><Clipboard /></div>
              <h3>Odontograma FDI Interactivo</h3>
              <p>Visualiza el historial clínico dental de tus pacientes de forma digital con notación FDI en un mapa 2D completamente interactivo.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Calendar /></div>
              <h3>Cuaderno de Citas IA</h3>
              <p>Optimiza tus horarios automáticamente reduciendo ausencias mediante notificaciones automáticas y agendas inteligentes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Sparkles /></div>
              <h3>Diagnóstico IA</h3>
              <p>Carga radiografías digitales y deja que nuestro modelo resalte áreas sospechosas de caries o reabsorción ósea al instante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Plans Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Nuestros Planes y Suscripciones</h2>
            <p>Escoge el plan ideal para el tamaño de tu clínica. Automatización de cuenta inmediata al realizar tu pago.</p>
          </div>

          {loading ? (
            <div className="loading-state">Cargando planes dinámicos de OdontologIA...</div>
          ) : (
            <div className="grid grid-3 pricing-grid">
              {plans.map((plan) => (
                <div key={plan.id} className={`pricing-card ${plan.price === '99.00' ? 'recommended' : ''}`}>
                  {plan.price === '99.00' && <div className="card-badge">Más Popular</div>}
                  <div className="card-header">
                    <h3>{plan.name}</h3>
                    <div className="price-container">
                      <span className="price-currency">$</span>
                      <span className="price-amount">{parseFloat(plan.price).toFixed(0)}</span>
                      <span className="price-period">/ mes</span>
                    </div>
                    <p className="plan-desc">{plan.description}</p>
                  </div>
                  <div className="card-features">
                    <h4>Módulos Habilitados:</h4>
                    <ul>
                      {plan.modules.map((mod, idx) => (
                        <li key={idx}>
                          <Check size={16} className="text-primary" />
                          <span>{getModuleName(mod)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-footer">
                    {/* The TiloPay redirection payment link is dynamically injected */}
                    <a href={plan.tilopay_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
                      Adquirir Plan
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
