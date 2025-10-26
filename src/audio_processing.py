import numpy as np
import librosa
from scipy.signal import find_peaks
from collections import Counter

class AudioProcessor:
    def __init__(self, sample_rate=22050):
        self.sample_rate = sample_rate
        self.note_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    def load_audio(self, file_path, start_time=0, duration=None):
        y, sr = librosa.load(file_path, sr=self.sample_rate, offset=start_time, duration=duration)
        return y, sr

    def detect_notes(self, y, sr, hop_length=512):
        chromagram = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)

        chroma_avg = np.mean(chromagram, axis=1)

        threshold = np.mean(chroma_avg) + 0.5 * np.std(chroma_avg)
        detected_notes = []

        for i, intensity in enumerate(chroma_avg):
            if intensity > threshold:
                detected_notes.append({
                    'note': self.note_names[i],
                    'intensity': float(intensity),
                    'midi': i + 60
                })

        detected_notes.sort(key=lambda x: x['intensity'], reverse=True)

        return detected_notes[:6]

    def identify_chord(self, notes):
        if not notes:
            return None

        note_indices = [self.note_names.index(n['note']) for n in notes]
        root = note_indices[0]

        intervals = sorted([(idx - root) % 12 for idx in note_indices])
        intervals_tuple = tuple(intervals)

        chord_patterns = {
            (0, 4, 7): 'major',
            (0, 3, 7): 'minor',
            (0, 4, 7, 11): 'maj7',
            (0, 3, 7, 10): 'min7',
            (0, 4, 7, 10): '7',
            (0, 3, 6): 'dim',
            (0, 4, 8): 'aug',
            (0, 2, 7): 'sus2',
            (0, 5, 7): 'sus4',
            (0, 4, 7, 9): 'add9',
            (0, 3, 7, 9): 'min9',
            (0, 4, 7, 10, 14): '9',
            (0, 4, 7, 14): 'add9',
        }

        matched_chord = None
        for pattern, chord_type in chord_patterns.items():
            if all(interval in intervals for interval in pattern):
                matched_chord = chord_type
                break

        if not matched_chord:
            if len(intervals) >= 2:
                if 4 in intervals:
                    matched_chord = 'major'
                elif 3 in intervals:
                    matched_chord = 'minor'
                else:
                    matched_chord = 'unknown'
            else:
                matched_chord = 'power'

        root_note = self.note_names[root]

        return {
            'root': root_note,
            'type': matched_chord,
            'name': f"{root_note}{matched_chord}" if matched_chord != 'unknown' else root_note,
            'notes': [n['note'] for n in notes],
            'intervals': intervals
        }

    def get_chord_positions(self, chord_info):
        root = chord_info['root']
        chord_type = chord_info['type']

        positions = self._get_guitar_positions(root, chord_type)

        return positions

    def _get_guitar_positions(self, root, chord_type):
        positions_db = {
            'C': {
                'major': {'frets': [None, 3, 2, 0, 1, 0], 'fingers': [0, 3, 2, 0, 1, 0], 'base_fret': 0},
                'minor': {'frets': [None, 3, 1, 0, 1, 3], 'fingers': [0, 3, 1, 0, 1, 4], 'base_fret': 0},
                '7': {'frets': [None, 3, 2, 3, 1, 0], 'fingers': [0, 3, 2, 4, 1, 0], 'base_fret': 0},
            },
            'D': {
                'major': {'frets': [None, None, 0, 2, 3, 2], 'fingers': [0, 0, 0, 1, 3, 2], 'base_fret': 0},
                'minor': {'frets': [None, None, 0, 2, 3, 1], 'fingers': [0, 0, 0, 2, 3, 1], 'base_fret': 0},
                '7': {'frets': [None, None, 0, 2, 1, 2], 'fingers': [0, 0, 0, 2, 1, 3], 'base_fret': 0},
            },
            'E': {
                'major': {'frets': [0, 2, 2, 1, 0, 0], 'fingers': [0, 2, 3, 1, 0, 0], 'base_fret': 0},
                'minor': {'frets': [0, 2, 2, 0, 0, 0], 'fingers': [0, 2, 3, 0, 0, 0], 'base_fret': 0},
                '7': {'frets': [0, 2, 0, 1, 0, 0], 'fingers': [0, 2, 0, 1, 0, 0], 'base_fret': 0},
            },
            'G': {
                'major': {'frets': [3, 2, 0, 0, 0, 3], 'fingers': [3, 2, 0, 0, 0, 4], 'base_fret': 0},
                'minor': {'frets': [3, 1, 0, 0, 3, 3], 'fingers': [3, 1, 0, 0, 4, 4], 'base_fret': 0},
                '7': {'frets': [3, 2, 0, 0, 0, 1], 'fingers': [3, 2, 0, 0, 0, 1], 'base_fret': 0},
            },
            'A': {
                'major': {'frets': [None, 0, 2, 2, 2, 0], 'fingers': [0, 0, 1, 2, 3, 0], 'base_fret': 0},
                'minor': {'frets': [None, 0, 2, 2, 1, 0], 'fingers': [0, 0, 2, 3, 1, 0], 'base_fret': 0},
                '7': {'frets': [None, 0, 2, 0, 2, 0], 'fingers': [0, 0, 2, 0, 3, 0], 'base_fret': 0},
            },
        }

        if root in positions_db and chord_type in positions_db[root]:
            return positions_db[root][chord_type]

        return {'frets': [0, 0, 0, 0, 0, 0], 'fingers': [0, 0, 0, 0, 0, 0], 'base_fret': 0}

    def process_audio_segment(self, file_path, start_time=0, duration=5):
        y, sr = self.load_audio(file_path, start_time, duration)

        notes = self.detect_notes(y, sr)

        chord_info = self.identify_chord(notes)

        if chord_info:
            positions = self.get_chord_positions(chord_info)
            chord_info['guitar_positions'] = positions

        return {
            'detected_notes': notes,
            'chord': chord_info,
            'duration': duration,
            'start_time': start_time
        }
