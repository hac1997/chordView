import React, { useState } from 'react';
import './FrequencyFilters.css';

const FrequencyFilters = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    subBass: 0,
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    presence: 0,
    brilliance: 0,
  });

  const [instrumentPreset, setInstrumentPreset] = useState('none');
  const [vocalRemoval, setVocalRemoval] = useState(false);

  const instrumentPresets = {
    none: {
      label: 'Sem Filtro',
      subBass: 0,
      bass: 0,
      lowMid: 0,
      mid: 0,
      highMid: 0,
      presence: 0,
      brilliance: 0,
      vocalRemoval: false,
    },
    vocals: {
      label: 'Vocais',
      subBass: -18,
      bass: -12,
      lowMid: -6,
      mid: 8,
      highMid: 10,
      presence: 8,
      brilliance: 4,
      vocalRemoval: false,
    },
    remove_vocals: {
      label: 'Remover Vocais',
      subBass: 4,
      bass: 6,
      lowMid: -8,
      mid: -20,
      highMid: -18,
      presence: -15,
      brilliance: 0,
      vocalRemoval: true,
    },
    guitar: {
      label: 'Guitarra',
      subBass: -15,
      bass: -8,
      lowMid: 6,
      mid: 10,
      highMid: 8,
      presence: 4,
      brilliance: -4,
      vocalRemoval: false,
    },
    bass_guitar: {
      label: 'Baixo',
      subBass: 12,
      bass: 10,
      lowMid: 6,
      mid: -10,
      highMid: -15,
      presence: -18,
      brilliance: -20,
      vocalRemoval: false,
    },
    drums: {
      label: 'Bateria',
      subBass: 8,
      bass: 10,
      lowMid: -6,
      mid: -12,
      highMid: 6,
      presence: 10,
      brilliance: 12,
      vocalRemoval: false,
    },
    piano: {
      label: 'Piano',
      subBass: -6,
      bass: 0,
      lowMid: 6,
      mid: 8,
      highMid: 8,
      presence: 6,
      brilliance: 10,
      vocalRemoval: false,
    },
  };

  const handlePresetChange = (preset) => {
    setInstrumentPreset(preset);
    const presetValues = instrumentPresets[preset];
    const newFilters = {
      subBass: presetValues.subBass,
      bass: presetValues.bass,
      lowMid: presetValues.lowMid,
      mid: presetValues.mid,
      highMid: presetValues.highMid,
      presence: presetValues.presence,
      brilliance: presetValues.brilliance,
      vocalRemoval: presetValues.vocalRemoval,
    };
    setActiveFilters(newFilters);
    setVocalRemoval(presetValues.vocalRemoval);
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
          <label>Sub-Grave</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.subBass > 0 ? '+' : ''}{activeFilters.subBass}dB</span>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={activeFilters.subBass}
              onChange={(e) => handleSliderChange('subBass', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">40Hz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Grave</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.bass > 0 ? '+' : ''}{activeFilters.bass}dB</span>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={activeFilters.bass}
              onChange={(e) => handleSliderChange('bass', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">100Hz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Médio-Grave</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.lowMid > 0 ? '+' : ''}{activeFilters.lowMid}dB</span>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={activeFilters.lowMid}
              onChange={(e) => handleSliderChange('lowMid', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">400Hz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Médio</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.mid > 0 ? '+' : ''}{activeFilters.mid}dB</span>
            <input
              type="range"
              min="-20"
              max="20"
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
              min="-20"
              max="20"
              step="1"
              value={activeFilters.highMid}
              onChange={(e) => handleSliderChange('highMid', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">2.5kHz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Presença</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.presence > 0 ? '+' : ''}{activeFilters.presence}dB</span>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={activeFilters.presence}
              onChange={(e) => handleSliderChange('presence', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">5kHz</span>
          </div>
        </div>

        <div className="eq-band">
          <label>Brilho</label>
          <div className="slider-container">
            <span className="slider-value">{activeFilters.brilliance > 0 ? '+' : ''}{activeFilters.brilliance}dB</span>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={activeFilters.brilliance}
              onChange={(e) => handleSliderChange('brilliance', parseInt(e.target.value))}
              className="eq-slider"
            />
            <span className="frequency-label">10kHz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequencyFilters;
