import React, { useState, useRef } from 'react';
import './AudioUploader.css';

const AudioUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/flac'];
      if (allowedTypes.includes(selectedFile.type) || selectedFile.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
        setFile(selectedFile);
        setError('');
        onFileSelect(selectedFile);
      } else {
        setError('Formato de arquivo não suportado. Use MP3, WAV, OGG, M4A ou FLAC.');
        setFile(null);
      }
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
      <h2 className="uploader-title">Visualizador de Espectro</h2>
      <p className="uploader-subtitle">Faça upload de uma música e veja o espectro em tempo real</p>

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
              <div className="upload-icon">🎧</div>
              <p className="drop-text">Arraste um arquivo de áudio aqui</p>
              <p className="drop-text-secondary">ou clique para selecionar</p>
              <p className="supported-formats">MP3, WAV, OGG, M4A, FLAC</p>
            </>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AudioUploader;
