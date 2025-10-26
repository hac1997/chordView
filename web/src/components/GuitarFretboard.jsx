import React from 'react';
import './GuitarFretboard.css';

const GuitarFretboard = ({ positions }) => {
  const strings = ['E', 'B', 'G', 'D', 'A', 'E'];
  const numFrets = 5;

  if (!positions || !positions.frets) {
    return null;
  }

  const { frets, fingers, base_fret } = positions;

  return (
    <div className="fretboard-container">
      <h3 className="fretboard-title">Posição no Braço do Violão</h3>
      <div className="fretboard">
        <div className="fret-numbers">
          <div className="fret-number-spacer"></div>
          {[...Array(numFrets)].map((_, i) => (
            <div key={i} className="fret-number">
              {base_fret + i + 1}
            </div>
          ))}
        </div>

        <div className="strings-container">
          {frets.map((fret, stringIndex) => (
            <div key={stringIndex} className="string-row">
              <div className="string-label">{strings[stringIndex]}</div>
              <div className="frets-row">
                {[...Array(numFrets)].map((_, fretIndex) => {
                  const isPressed = fret !== null && fret === fretIndex + base_fret;
                  const isOpen = fret === 0 && fretIndex === 0;
                  const isMuted = fret === null;
                  const fingerNumber = isPressed ? fingers[stringIndex] : null;

                  return (
                    <div key={fretIndex} className="fret-cell">
                      <div className="fret-line" />
                      {isPressed && (
                        <div className="finger-dot">
                          {fingerNumber > 0 && (
                            <span className="finger-number">{fingerNumber}</span>
                          )}
                        </div>
                      )}
                      {isOpen && fretIndex === 0 && (
                        <div className="open-string">○</div>
                      )}
                      {isMuted && fretIndex === 0 && (
                        <div className="muted-string">✕</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-symbol open">○</span>
          <span>Corda solta</span>
        </div>
        <div className="legend-item">
          <span className="legend-symbol muted">✕</span>
          <span>Não tocar</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot"></div>
          <span>Dedos (1-4)</span>
        </div>
      </div>
    </div>
  );
};

export default GuitarFretboard;
