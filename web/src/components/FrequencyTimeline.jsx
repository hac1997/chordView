import React, { useRef, useEffect } from 'react';
import './FrequencyTimeline.css';

const FrequencyTimeline = ({ timelineData, currentTime, duration }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && currentTime > 0) {
      const scrollPosition = (currentTime / duration) * containerRef.current.scrollWidth;
      containerRef.current.scrollLeft = scrollPosition - containerRef.current.clientWidth / 2;
    }
  }, [currentTime, duration]);

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const frequencyToNote = (frequency) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const roundedNote = Math.round(noteNum) + 69;
    const octave = Math.floor(roundedNote / 12) - 1;
    const note = noteNames[roundedNote % 12];
    return `${note}${octave}`;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(1);
    return `${minutes}:${seconds.padStart(4, '0')}`;
  };

  return (
    <div className="frequency-timeline">
      <div className="timeline-header">
        <h3>Timeline de Frequências Dominantes</h3>
        <p className="timeline-info">
          Mostrando as 3 frequências mais fortes em cada momento
        </p>
      </div>

      <div className="timeline-container" ref={containerRef}>
        <div className="timeline-content">
          {timelineData.map((entry, index) => (
            <div
              key={index}
              className={`timeline-entry ${entry.time <= currentTime ? 'passed' : ''} ${
                Math.abs(entry.time - currentTime) < 0.5 ? 'current' : ''
              }`}
            >
              <div className="timeline-time">{formatTime(entry.time)}</div>
              <div className="timeline-frequencies">
                {entry.frequencies.map((freq, idx) => (
                  <div key={idx} className="frequency-item">
                    <span className="frequency-note">{frequencyToNote(freq)}</span>
                    <span className="frequency-hz">{Math.round(freq)}Hz</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {timelineData.length === 0 && (
        <div className="timeline-empty">
          <p>Inicie a reprodução para ver as frequências ao longo do tempo</p>
        </div>
      )}
    </div>
  );
};

export default FrequencyTimeline;
