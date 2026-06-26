import React, { useState } from 'react';
import { Upload, Brain, Check, RefreshCw, FileText, Activity } from 'lucide-react';
import './DiagnosticsIA.css';

export default function DiagnosticsIA() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [patientName, setPatientName] = useState('Roberto López');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock upload and preview
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const runIAAnalysis = () => {
    if (!selectedImage) return;
    setAnalyzing(true);

    // Simulate backend OpenAI Vision API processing time
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        accuracy: "94.5%",
        findings: [
          { id: 1, tooth: 46, issue: "Caries Oclusal profunda", severity: "Alta", action: "Se recomienda tratamiento de endodoncia o restauración directa." },
          { id: 2, tooth: 11, issue: "Reabsorción ósea marginal ligera", severity: "Leve", action: "Monitorear nivel de cresta ósea y realizar profilaxis profunda." }
        ],
        summary: "El análisis por visión artificial de OdontologIA ha identificado una posible caries penetrante en el molar inferior derecho (46) con riesgo de compromiso pulpar, y pérdida ósea alveolar leve generalizada en el maxilar superior.",
        overlays: [
          { x: "55%", y: "45%", width: "60px", height: "60px", label: "Caries (Diente 46)", color: "red" },
          { x: "32%", y: "30%", width: "90px", height: "35px", label: "Reabsorción Ósea", color: "orange" }
        ]
      });
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="diagnostics-view">
      <header className="diagnostics-header">
        <div>
          <h1>Centro de Diagnóstico IA</h1>
          <p className="subtitle">Módulo de Visión Artificial para Radiografías Dentales</p>
        </div>
      </header>

      <div className="diagnostics-main-grid">
        {/* Left: Upload and Viewer */}
        <div className="viewer-section card bg-surface">
          {!selectedImage ? (
            <div className="upload-placeholder">
              <Upload size={48} className="text-muted" />
              <h3>Cargar Radiografía Digital</h3>
              <p>Arrastra tu archivo o haz clic para buscar una imagen (Formatos: PNG, JPG, DICOM)</p>
              <label className="btn btn-primary btn-upload">
                Buscar Archivo
                <input type="file" onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
              </label>
            </div>
          ) : (
            <div className="radiography-viewer">
              <div className="viewer-canvas">
                <img src={selectedImage} alt="Radiografía Dental" className="xray-image" />
                
                {/* Render SVG overlay boxes dynamically based on AI findings */}
                {result && result.overlays.map((overlay, idx) => (
                  <div 
                    key={idx}
                    className={`ai-overlay-box ${overlay.color}`}
                    style={{
                      left: overlay.x,
                      top: overlay.y,
                      width: overlay.width,
                      height: overlay.height
                    }}
                  >
                    <span className="overlay-tooltip">{overlay.label}</span>
                  </div>
                ))}
              </div>
              <div className="viewer-actions">
                <button className="btn btn-outline" onClick={resetAnalysis}>
                  <RefreshCw size={16} /> Cargar otra imagen
                </button>
                {!result && (
                  <button className="btn btn-primary" onClick={runIAAnalysis} disabled={analyzing}>
                    <Brain size={16} /> {analyzing ? 'Procesando con IA...' : 'Ejecutar Diagnóstico IA'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Diagnosis Details */}
        <div className="details-section">
          {analyzing && (
            <div className="analysis-loading-card card bg-surface">
              <div className="spinner"></div>
              <h4>Analizando Radiografía...</h4>
              <p>El motor de Inteligencia Artificial de OdontologIA está examinando contrastes y densidades óseas en la imagen.</p>
            </div>
          )}

          {!analyzing && !result && selectedImage && (
            <div className="prompt-analysis-card card bg-surface">
              <Brain size={32} className="text-primary animate-pulse" />
              <h4>Imagen Lista para Análisis</h4>
              <p>Haz clic en "Ejecutar Diagnóstico IA" para procesar esta radiografía con el modelo de visión artificial.</p>
            </div>
          )}

          {!analyzing && result && (
            <div className="results-card card bg-surface animate-fade-in">
              <div className="results-header">
                <h3>Reporte Clínico Generado por IA</h3>
                <span className="accuracy-pill">Confianza: {result.accuracy}</span>
              </div>

              <div className="results-summary">
                <h4>Resumen del Hallazgo:</h4>
                <p>{result.summary}</p>
              </div>

              <div className="findings-list">
                <h4>Diagnósticos Detallados por Pieza Dental:</h4>
                {result.findings.map(finding => (
                  <div key={finding.id} className={`finding-card ${finding.severity.toLowerCase()}`}>
                    <div className="finding-title-row">
                      <span className="tooth-badge">Diente {finding.tooth}</span>
                      <span className={`severity-tag ${finding.severity.toLowerCase()}`}>
                        Severidad {finding.severity}
                      </span>
                    </div>
                    <strong>{finding.issue}</strong>
                    <p>{finding.action}</p>
                  </div>
                ))}
              </div>

              <div className="results-footer">
                <button className="btn btn-primary btn-block">
                  <Check size={16} /> Vincular al Expediente de {patientName}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
