# CapLearn - Interactive Language Learning Through Video Subtitles

CapLearn is an application designed to help users learn languages through video content. It processes videos from YouTube or direct uploads, generates subtitles, and provides an interactive interface for vocabulary building and comprehension.

![CapLearn Demo](./front/public/vite.svg)

## Features

### Current Functionality

- **Video Processing**
  - Upload local video files (up to 100MB)
  - Import videos from YouTube URLs (up to 30 minutes)
  - Automatic subtitle generation using Groq's Whisper API

- **Interactive Learning Interface**
  - Synchronized subtitles with word-level timestamps
  - Interactive word selection for definitions
  - Save words to personal vocabulary list
  - Dark/light mode for comfortable viewing

- **Vocabulary Tools**
  - Track words you're learning
  - Export subtitles in various formats
  - Vocabulary statistics and progress tracking

## Technology Stack

### Frontend
- React (with Vite)
- Tailwind CSS for styling
- Context API for state management
- Custom components for video playback and subtitle display

### Backend
- Node.js with Express
- File processing with Multer
- ffmpeg for audio extraction
- yt-dlp for YouTube video downloading
- Groq API integration for speech-to-text transcription

### DevOps
- Docker containerization
- Multi-container orchestration with docker-compose

## Project Structure

```
CapLearn/
├── docker-compose.yml          # Multi-container definition
├── front/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── context/            # Context providers
│   │   ├── services/           # API service connections
│   │   └── utils/              # Utility functions
│   └── Dockerfile              # Frontend container configuration
│
├── back/                       # Backend Node.js API
│   ├── controllers/            # API route controllers
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Utility functions
│   ├── uploads/                # Temporary file storage
│   └── Dockerfile              # Backend container configuration
│
└── README.md                   # Project documentation
```

## Running the Application

### Prerequisites
- Docker and docker-compose installed
- Internet connection for API access

### Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd CapLearn
   ```

2. Build and start the Docker containers:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:80 (or http://localhost)
   - Backend API: http://localhost:3000

### Testing the API

You can test the YouTube subtitle generation feature with:

```bash
curl -X POST http://localhost:3000/api/subtitles/youtube \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Usage Guide

### Importing Videos
1. Upload a local video file using the file picker
2. Or paste a YouTube URL in the provided input field
3. Click "Process" and wait for the transcription to complete

### Learning with Subtitles
1. The video will play with synchronized subtitles
2. Click on any word to see its definition
3. Use the "Save Word" button to add words to your vocabulary list

### Managing Vocabulary
1. Navigate to the Saved Words section
2. Review your vocabulary list
3. Export words or subtitles as needed

## Technical Implementation

### Video Processing Flow
1. Videos are uploaded or downloaded from YouTube
2. Audio is extracted using ffmpeg
3. Audio is transcribed using the Groq API
4. Transcription is formatted with word-level timestamps
5. Original media files are cleaned up after processing

### YouTube Video Handling
- Uses yt-dlp for efficient video downloading
- Enforces size and duration limits
- Extracts video metadata for display

### Subtitle Generation
- Transcription through Groq's Whisper API
- Word-level timestamps for precise synchronization
- Formatted for interactive display

## Environment Variables

The following environment variables can be configured:

- `YT_DLP_PATH`: Path to the yt-dlp executable (default: 'yt-dlp')
- `NODE_ENV`: Environment setting (development/production)
- `GROQ_API_KEY`: API key for Groq transcription service

## Troubleshooting

### Common Issues

**Video Processing Errors**
- Ensure videos are under 100MB and 30 minutes
- Check Docker logs for detailed error messages:
  ```bash
  docker-compose logs -f backend
  ```

**API Connection Issues**
- Verify all containers are running:
  ```bash
  docker-compose ps
  ```
- Check network connectivity between containers

## Future Development

Planned enhancements include:
- User authentication system
- Spaced repetition for vocabulary practice
- Multiple language support
- Advanced vocabulary analytics
- Integration with language learning APIs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Groq](https://groq.com/) for their Whisper API implementation
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for YouTube video extraction
- [ffmpeg](https://ffmpeg.org/) for media processing

---


