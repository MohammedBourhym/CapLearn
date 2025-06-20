import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function transcribeAudioWithGroq(audioFilePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(audioFilePath));
  form.append('model', 'whisper-large-v3');

  try {
    const response = await axios.post(GROQ_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
