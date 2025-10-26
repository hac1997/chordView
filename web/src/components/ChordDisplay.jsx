import React from 'react';
import GuitarFretboard from './GuitarFretboard';
import './ChordDisplay.css';

const ChordDisplay = ({ result }) => {
  if (!result) {
    return null;
  }

  const { detected_notes, chord } = result;

  return (
    <div className="chord-display">
      {chord ? (
        <>
          <div className="chord-header">
            <h2 className="chord-name">{chord.name}</h2>
            <div className="chord-details">
              <span className="chord-root">Tônica: {chord.root}</span>
              <span className="chord-type">Tipo: {chord.type}</span>
            </div>
          </div>

          <GuitarFretboard positions={chord.guitar_positions} />

          <div className="notes-section">
            <h3 className="notes-title">Notas Detectadas</h3>
            <div className="notes-grid">
              {detected_notes.map((note, index) => (
                <div key={index} className="note-card">
                  <div className="note-name">{note.note}</div>
                  <div className="note-intensity">
                    <div className="intensity-bar">
                      <div
                        className="intensity-fill"
                        style={{ width: `${Math.min(100, note.intensity * 100)}%` }}
                      />
                    </div>
                    <span className="intensity-value">
                      {(note.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {chord.notes && (
            <div className="chord-notes-section">
              <h3 className="chord-notes-title">Notas do Acorde</h3>
              <div className="chord-notes-list">
                {chord.notes.map((note, index) => (
                  <span key={index} className="chord-note-badge">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="no-chord">
          <div className="no-chord-icon">🎸</div>
          <p className="no-chord-text">Nenhum acorde identificado</p>
          <p className="no-chord-hint">
            Tente ajustar o tempo inicial ou a duração do trecho
          </p>
        </div>
      )}
    </div>
  );
};

export default ChordDisplay;
