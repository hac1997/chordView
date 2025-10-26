import React, { useState } from 'react';
import './FrequencyFilters.css';

const FrequencyFilters = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    treble: 0,
  });

  const [instrumentPreset, setInstrumentPreset] = useState('none');

  const instrumentPresets = {
    none: {
      label: 'Sem Filtro',
      bass: 0,
      lowMid: 0,
      mid: 0,
      highMid: 0,
      treble: 0,
    },
    vocals: {
      label: 'Vocais',
      bass: -8,
      lowMid: -4,
      mid: 6,
      highMid: 4,
      treble: 2,
    },
    guitar: {
      label: 'Guitarra',
      bass: -6,
      lowMid: 4,
      mid: 6,
      highMid: 4,
      treble: -2,
    },
    bass_guitar: {
      label: 'Baixo',
      bass: 8,
      lowMid: 6,
      mid: -4,
      highMid: -6,
      treble: -8,
    },
    drums: {
      label: 'Bateria',
      bass: 6,
      lowMid: -2,
      mid: -4,
      highMid: 4,
      treble: 6,
    },
    piano: {
      label: 'Piano',
      bass: 2,
      lowMid: 4,
      mid: 4,
      highMid: 4,
      treble: 4,
    },
  };

  const handlePresetChange = (preset) => {
    setInstrumentPreset(preset);
    const presetValues = instrumentPresets[preset];
    const newFilters = {
      bass: presetValues.bass,
      lowMid: presetValues.lowMid,
      mid: presetValues.mid,
      highMid: presetValues.highMid,
      treble: presetValues.treble,
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSliderChange = (band, value) => {
    const newFilters = { ...activeFilters, [band]: value };
    setActiveFilters(newFilters);
    setInstrumentPreset('custom');
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    handlePresetChange('none');
  };

  return (
    <div className="frequency-filters">
      <div className="filters-header">
        <h3>Filtros de Frequência</h3>
        <button className="reset-button" onClick={resetFilters}>
          Resetar
        </button>
      </div>

      <div className="preset-buttons">
        {Object.entries(instrumentPresets).map(([key, preset]) => (
          <button
            key={key}
            className={`preset-button ${instrumentPreset === key ? 'active' : ''}`}
            onClick={() => handlePresetChange(key)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="equalizer">
        <div className="eq-band">
          <label>Grave</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.bass > 0 ? '+' : ''}{activeFilters.bass}dB</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={activeFilters.bass}
              onChange={(e) => handleSliderChange('bass', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">60Hz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Médio-Grave</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.lowMid > 0 ? '+' : ''}{activeFilters.lowMid}dB</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={activeFilters.lowMid}
              onChange={(e) => handleSliderChange('lowMid', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">250Hz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Médio</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.mid > 0 ? '+' : ''}{activeFilters.mid}dB</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={activeFilters.mid}
              onChange={(e) => handleSliderChange('mid', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">1kHz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Médio-Agudo</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.highMid > 0 ? '+' : ''}{activeFilters.highMid}dB</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={activeFilters.highMid}
              onChange={(e) => handleSliderChange('highMid', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">4kHz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Agudo</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.treble > 0 ? '+' : ''}{activeFilters.treble}dB</span>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={activeFilters.treble}
              onChange={(e) => handleSliderChange('treble', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">8kHz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyFilters;
