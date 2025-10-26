import { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import AudioPlayer from './components/AudioPlayer';
import './App.css';

function App() {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileSelect = (file) => {
    setAudioFile(file);
  };

  return (
    <div className="app">
      <div className="app-background" />

      <div className="app-content">
        <header className="app-header">
          <div className="logo">🎵</div>
          <h1 className="app-title">Spectrum Visualizer</h1>
          <p className="app-description">
            Visualize o espectro de frequência de qualquer música em tempo real
          </p>
        </header>

        <main className="app-main">
          <AudioUploader onFileSelect={handleFileSelect} />

          {audioFile && <AudioPlayer audioFile={audioFile} />}
        </main>

        <footer className="app-footer">
          <p>Análise de áudio em tempo real usando Web Audio API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
