import { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import AudioPlayer from './components/AudioPlayer';
import FrequencyFilters from './components/FrequencyFilters';
import './App.css';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [filters, setFilters] = useState({
    subBass: 0,
    bass: 0,
    lowMid: 0,
    mid: 0,
    highMid: 0,
    presence: 0,
    brilliance: 0,
    vocalRemoval: false,
  });

  const handleFileSelect = (file) => {
    setAudioFile(file);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="app">
      <div className="app-background" />

      <div className="app-content">
        <header className="app-header">
          <div className="logo">🎵</div>
          <h1 className="app-title">Spectrum Visualizer</h1>
          <p className="app-description">
            Visualize o espectro de frequência e filtre instrumentos em tempo real
          </p>
        </header>

        <main className="app-main">
          <AudioUploader onFileSelect={handleFileSelect} />

          {audioFile && (
            <>
              <FrequencyFilters onFilterChange={handleFilterChange} />
              <AudioPlayer audioFile={audioFile} filters={filters} />
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>Análise e equalização de áudio usando Web Audio API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
