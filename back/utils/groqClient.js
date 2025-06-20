import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function transcribeAudioWithGroq(audioFilePath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(audioFilePath));
    form.append('model', 'whisper-large-v3');
    form.append('response_format', 'verbose_json');
    form.append('timestamp_granularities[]', 'word');
    form.append('timestamp_granularities[]', 'segment');
    
    const response = await axios.post(GROQ_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      maxBodyLength: Infinity,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
}