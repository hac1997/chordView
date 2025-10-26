import { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import ChordDisplay from './components/ChordDisplay';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysisComplete = (analysisResult) => {
    setResult(analysisResult);
  };

  return (
    <div className="app">
      <div className="app-background" />

      <div className="app-content">
        <header className="app-header">
          <div className="logo">🎸</div>
          <h1 className="app-title">Chord Finder</h1>
          <p className="app-description">
            Identifique os acordes de qualquer música com inteligência artificial
          </p>
        </header>

        <main className="app-main">
          <AudioUploader
            onAnalysisComplete={handleAnalysisComplete}
            loading={loading}
            setLoading={setLoading}
          />

          {result && <ChordDisplay result={result} />}
        </main>

        <footer className="app-footer">
          <p>Desenvolvido com análise espectral e reconhecimento de padrões</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
