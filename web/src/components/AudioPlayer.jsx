import React, { useRef, useState, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioFile, filters }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const filtersRef = useRef({});

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const frequencyToNote = (frequency) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const roundedNote = Math.round(noteNum) + 69;
    const octave = Math.floor(roundedNote / 12) - 1;
    const note = noteNames[roundedNote % 12];
    return `${note}${octave}`;
  };

  useEffect(() => {
    if (audioFile) {
      const audio = audioRef.current;
      const url = URL.createObjectURL(audioFile);
      audio.src = url;
      audio.volume = volume;

      return () => {
        URL.revokeObjectURL(url);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }
  }, [audioFile]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (filters && audioContextRef.current) {
      const context = audioContextRef.current;

      const bassFilter = filtersRef.current.bass || context.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 60;
      bassFilter.gain.value = filters.bass || 0;

      const lowMidFilter = filtersRef.current.lowMid || context.createBiquadFilter();
      lowMidFilter.type = 'peaking';
      lowMidFilter.frequency.value = 250;
      lowMidFilter.Q.value = 1;
      lowMidFilter.gain.value = filters.lowMid || 0;

      const midFilter = filtersRef.current.mid || context.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1000;
      midFilter.Q.value = 1;
      midFilter.gain.value = filters.mid || 0;

      const highMidFilter = filtersRef.current.highMid || context.createBiquadFilter();
      highMidFilter.type = 'peaking';
      highMidFilter.frequency.value = 4000;
      highMidFilter.Q.value = 1;
      highMidFilter.gain.value = filters.highMid || 0;

      const trebleFilter = filtersRef.current.treble || context.createBiquadFilter();
      trebleFilter.type = 'highshelf';
      trebleFilter.frequency.value = 8000;
      trebleFilter.gain.value = filters.treble || 0;

      if (!filtersRef.current.bass) {
        const source = sourceRef.current;
        const analyser = analyserRef.current;

        source.disconnect();
        source.connect(bassFilter);
        bassFilter.connect(lowMidFilter);
        lowMidFilter.connect(midFilter);
        midFilter.connect(highMidFilter);
        highMidFilter.connect(trebleFilter);
        trebleFilter.connect(analyser);
        analyser.connect(context.destination);

        filtersRef.current = {
          bass: bassFilter,
          lowMid: lowMidFilter,
          mid: midFilter,
          highMid: highMidFilter,
          treble: trebleFilter,
        };
      }
    }
  }, [filters]);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.85;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
  };

  const drawSpectrum = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const sampleRate = audioContextRef.current.sampleRate;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(0.5, '#0ea5e9');
      gradient.addColorStop(1, '#06b6d4');

      const minFreq = 20;
      const maxFreq = 8000;
      const barCount = 120;
      const barWidth = width / barCount;

      const notesToShow = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const labeledNotes = [];

      for (let octave = 1; octave <= 7; octave++) {
        notesToShow.forEach(note => {
          const freq = 440 * Math.pow(2, (noteNames.indexOf(note) - 9 + (octave - 4) * 12) / 12);
          if (freq >= minFreq && freq <= maxFreq) {
            labeledNotes.push({ note: `${note}${octave}`, freq });
          }
        });
      }

      for (let i = 0; i < barCount; i++) {
        const freqRatio = i / barCount;
        const frequency = minFreq * Math.pow(maxFreq / minFreq, freqRatio);

        const binIndex = Math.floor((frequency / sampleRate) * analyser.fftSize);
        const barHeight = (dataArray[binIndex] / 255) * (height - 40) * 0.9;

        const x = i * barWidth;
        const y = height - barHeight - 40;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);

        ctx.shadowBlur = 15;
        ctx.shadowColor = '#3b82f6';
        ctx.fillRect(x, y, barWidth - 1, barHeight);
        ctx.shadowBlur = 0;
      }

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height - 40);
      ctx.lineTo(width, height - 40);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';

      labeledNotes.forEach(({ note, freq }) => {
        const freqRatio = Math.log(freq / minFreq) / Math.log(maxFreq / minFreq);
        const x = freqRatio * width;

        if (x >= 0 && x <= width) {
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, height - 40);
          ctx.lineTo(x, height - 35);
          ctx.stroke();

          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(note, x, height - 20);

          ctx.fillStyle = '#64748b';
          ctx.font = '9px monospace';
          ctx.fillText(`${Math.round(freq)}Hz`, x, height - 8);
          ctx.font = '11px monospace';
        }
      });
    };

    draw();
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (!isPlaying) {
      initializeAudioContext();
      audio.play();
      setIsPlaying(true);
      drawSpectrum();
    } else {
      audio.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <canvas
        ref={canvasRef}
        className="spectrum-canvas"
        width={1200}
        height={400}
      />

      <div className="player-controls">
        <button className="play-button" onClick={togglePlayPause}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="time-display">
          {formatTime(currentTime)}
        </div>

        <div className="progress-bar" onClick={handleSeek}>
          <div
            className="progress-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <div className="time-display">
          {formatTime(duration)}
        </div>

        <div className="volume-control">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
