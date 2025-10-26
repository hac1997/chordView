import React, { useState, useRef } from 'react';
import './AudioUploader.css';

const AudioUploader = ({ onAnalysisComplete, loading, setLoading }) => {
  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac'];
      if (allowedTypes.includes(selectedFile.type) || selectedFile.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Formato de arquivo não suportado. Use MP3, WAV, OGG, M4A ou FLAC.');
        setFile(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo de áudio.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('start_time', startTime);
    formData.append('duration', duration);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao analisar o áudio');
      }

      const result = await response.json();
      onAnalysisComplete(result);
    } catch (err) {
      setError('Erro ao processar o áudio. Verifique se o servidor está rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  return (
    <div className="uploader-container">
      <h2 className="uploader-title">Identificador de Acordes</h2>
      <p className="uploader-subtitle">Faça upload de uma música e descubra os acordes</p>

      <div
        className="drop-zone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="drop-zone-content">
          {file ? (
            <>
              <div className="file-icon">🎵</div>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p className="drop-text">Arraste um arquivo de áudio aqui</p>
              <p className="drop-text-secondary">ou clique para selecionar</p>
              <p className="supported-formats">MP3, WAV, OGG, M4A, FLAC</p>
            </>
          )}
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="startTime">Início (segundos)</label>
          <input
            id="startTime"
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(Math.max(0, parseFloat(e.target.value) || 0))}
            min="0"
            step="0.5"
            disabled={loading}
          />
        </div>

        <div className="control-group">
          <label htmlFor="duration">Duração (segundos)</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseFloat(e.target.value) || 5))}
            min="1"
            max="30"
            step="0.5"
            disabled={loading}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={!file || loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Analisando...
          </>
        ) : (
          'Analisar Acordes'
        )}
      </button>
    </div>
  );
};

export default AudioUploader;
