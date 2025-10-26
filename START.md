# Como Iniciar o Chord Finder

## Pré-requisitos

1. Python 3.8 ou superior
2. Node.js 18 ou superior
3. pip (gerenciador de pacotes Python)

## Instalação

### 1. Instalar dependências Python

```bash
pip install -r requirements.txt
```

### 2. Instalar dependências do frontend

```bash
cd web
npm install
cd ..
```

## Execução

### Opção 1: Executar backend e frontend separadamente

**Terminal 1 - Backend:**
```bash
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

### Opção 2: Executar tudo de uma vez (recomendado)

Primeiro instale o concurrently:
```bash
npm install
```

Depois execute:
```bash
npm run dev
```

## Uso

1. Acesse `http://localhost:5173` no navegador
2. Faça upload de um arquivo de áudio (MP3, WAV, OGG, M4A ou FLAC)
3. Configure o tempo inicial e duração do trecho a ser analisado
4. Clique em "Analisar Acordes"
5. Visualize o acorde identificado e sua posição no braço do violão

## Tecnologias Utilizadas

- **Backend**: Flask, Librosa, NumPy, SciPy
- **Frontend**: React, Vite
- **Análise**: Espectrograma cromático (CQT) + reconhecimento de padrões

## Estrutura do Projeto

```
chord-finder/
├── main.py                 # API Flask
├── requirements.txt        # Dependências Python
├── src/
│   └── audio_processing.py # Lógica de processamento de áudio
└── web/                    # Frontend React
    ├── src/
    │   ├── components/
    │   │   ├── AudioUploader.jsx
    │   │   ├── ChordDisplay.jsx
    │   │   └── GuitarFretboard.jsx
    │   └── App.jsx
    └── package.json
```
