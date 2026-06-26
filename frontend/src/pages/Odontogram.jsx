import React, { useState } from 'react';
import { Save, RefreshCw, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import './Odontogram.css';

// FDI Tooth coordinates representation with 5 surfaces (Top, Right, Bottom, Left, Center)
const ToothSVG = ({ number, condition, onSurfaceClick }) => {
  const getSurfaceColor = (surface) => {
    const status = condition && condition.surfaces ? condition.surfaces[surface] : null;
    if (status === 'caries') return '#ef4444'; // Red
    if (status === 'restored') return '#2563eb'; // Blue
    return '#ffffff'; // White/default
  };

  const isAbsent = condition && condition.absent;
  const isCrown = condition && condition.crown;

  return (
    <div className={`tooth-item ${isAbsent ? 'absent' : ''} ${isCrown ? 'crown' : ''}`}>
      <span className="tooth-number">{number}</span>
      <div className="tooth-svg-wrapper">
        <svg viewBox="0 0 80 80" width="55" height="55" className="tooth-svg">
          {/* Surface Top (Occlusal/Vestibular) */}
          <polygon 
            points="15,15 65,15 50,30 30,30" 
            fill={getSurfaceColor('top')} 
            stroke="#737784" 
            strokeWidth="1.5"
            onClick={() => onSurfaceClick(number, 'top')}
          />
          {/* Surface Right (Distal/Mesial) */}
          <polygon 
            points="65,15 65,65 50,50 50,30" 
            fill={getSurfaceColor('right')} 
            stroke="#737784" 
            strokeWidth="1.5"
            onClick={() => onSurfaceClick(number, 'right')}
          />
          {/* Surface Bottom (Lingual/Palatine) */}
          <polygon 
            points="15,65 30,50 50,50 65,65" 
            fill={getSurfaceColor('bottom')} 
            stroke="#737784" 
            strokeWidth="1.5"
            onClick={() => onSurfaceClick(number, 'bottom')}
          />
          {/* Surface Left (Mesial/Distal) */}
          <polygon 
            points="15,15 30,30 30,50 15,65" 
            fill={getSurfaceColor('left')} 
            stroke="#737784" 
            strokeWidth="1.5"
            onClick={() => onSurfaceClick(number, 'left')}
          />
          {/* Surface Center (Occlusal center) */}
          <rect 
            x="30" y="30" width="20" height="20" 
            fill={getSurfaceColor('center')} 
            stroke="#737784" 
            strokeWidth="1.5"
            onClick={() => onSurfaceClick(number, 'center')}
          />
        </svg>

        {isAbsent && <div className="strike-line"></div>}
      </div>
    </div>
  );
};

export default function Odontogram() {
  // Store conditions: { toothNumber: { absent: bool, crown: bool, surfaces: { top: 'caries'/'restored'/null, ... } } }
  const [teethConditions, setTeethConditions] = useState({});
  const [selectedConditionType, setSelectedConditionType] = useState('caries'); // 'caries', 'restored', 'absent', 'crown', 'clear'
  const [patientName, setPatientName] = useState('Roberto López');
  const [saved, setSaved] = useState(false);

  const handleSurfaceClick = (toothNum, surface) => {
    setTeethConditions(prev => {
      const tooth = prev[toothNum] || { absent: false, crown: false, surfaces: {} };
      
      if (selectedConditionType === 'absent') {
        return { ...prev, [toothNum]: { ...tooth, absent: !tooth.absent } };
      }
      if (selectedConditionType === 'crown') {
        return { ...prev, [toothNum]: { ...tooth, crown: !tooth.crown } };
      }
      if (selectedConditionType === 'clear') {
        return { ...prev, [toothNum]: { absent: false, crown: false, surfaces: {} } };
      }

      // Assign caries or restored status to specific surface
      const updatedSurfaces = { ...tooth.surfaces };
      if (updatedSurfaces[surface] === selectedConditionType) {
        delete updatedSurfaces[surface]; // toggle off
      } else {
        updatedSurfaces[surface] = selectedConditionType;
      }

      return {
        ...prev,
        [toothNum]: { ...tooth, absent: false, crown: false, surfaces: updatedSurfaces }
      };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetOdontogram = () => {
    setTeethConditions({});
  };

  // Quadrants FDI numbering
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];

  return (
    <div className="odontogram-view">
      <header className="odontogram-header">
        <div>
          <h1>Odontograma FDI</h1>
          <p className="subtitle">Paciente: <strong>{patientName}</strong></p>
        </div>
        <div className="odontogram-actions">
          <button className="btn btn-outline" onClick={resetOdontogram}>
            <RefreshCw size={16} /> Limpiar Todo
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} /> Guardar Diagnóstico
          </button>
        </div>
      </header>

      {saved && (
        <div className="success-toast">
          <CheckCircle2 size={16} />
          <span>Odontograma guardado exitosamente en el expediente digital.</span>
        </div>
      )}

      {/* Toolbar / Selectors */}
      <section className="odontogram-toolbar">
        <h3>Herramientas de Diagnóstico Dental</h3>
        <div className="tool-selector-group">
          <button 
            className={`tool-btn caries ${selectedConditionType === 'caries' ? 'active' : ''}`}
            onClick={() => setSelectedConditionType('caries')}
          >
            <span className="color-indicator caries"></span> Caries (Rojo)
          </button>
          <button 
            className={`tool-btn restored ${selectedConditionType === 'restored' ? 'active' : ''}`}
            onClick={() => setSelectedConditionType('restored')}
          >
            <span className="color-indicator restored"></span> Calza / Resina (Azul)
          </button>
          <button 
            className={`tool-btn absent ${selectedConditionType === 'absent' ? 'active' : ''}`}
            onClick={() => setSelectedConditionType('absent')}
          >
            <span className="indicator-symbol">X</span> Ausente / Extraído
          </button>
          <button 
            className={`tool-btn crown ${selectedConditionType === 'crown' ? 'active' : ''}`}
            onClick={() => setSelectedConditionType('crown')}
          >
            <span className="indicator-symbol">O</span> Corona Dental
          </button>
          <button 
            className={`tool-btn clear ${selectedConditionType === 'clear' ? 'active' : ''}`}
            onClick={() => setSelectedConditionType('clear')}
          >
            Borrador
          </button>
        </div>
      </section>

      {/* SVG FDI Interactive Map Grid */}
      <section className="odontogram-map bg-surface">
        {/* Upper Arch */}
        <div className="arch upper-arch">
          <h4 className="arch-label">Arcada Superior (Maxilar)</h4>
          <div className="quadrants-row">
            {/* Quadrant 1: Upper Right */}
            <div className="quadrant right-quadrant">
              {upperRight.map(num => (
                <ToothSVG 
                  key={num} 
                  number={num} 
                  condition={teethConditions[num]} 
                  onSurfaceClick={handleSurfaceClick} 
                />
              ))}
            </div>
            {/* Quadrant 2: Upper Left */}
            <div className="quadrant left-quadrant">
              {upperLeft.map(num => (
                <ToothSVG 
                  key={num} 
                  number={num} 
                  condition={teethConditions[num]} 
                  onSurfaceClick={handleSurfaceClick} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="divider-line"></div>

        {/* Lower Arch */}
        <div className="arch lower-arch">
          <div className="quadrants-row">
            {/* Quadrant 4: Lower Right (rendered left to align with anatomically lower right mirroring) */}
            <div className="quadrant right-quadrant">
              {lowerRight.reverse().map(num => (
                <ToothSVG 
                  key={num} 
                  number={num} 
                  condition={teethConditions[num]} 
                  onSurfaceClick={handleSurfaceClick} 
                />
              ))}
            </div>
            {/* Quadrant 3: Lower Left */}
            <div className="quadrant left-quadrant">
              {lowerLeft.map(num => (
                <ToothSVG 
                  key={num} 
                  number={num} 
                  condition={teethConditions[num]} 
                  onSurfaceClick={handleSurfaceClick} 
                />
              ))}
            </div>
          </div>
          <h4 className="arch-label">Arcada Inferior (Mandíbula)</h4>
        </div>
      </section>
    </div>
  );
}
