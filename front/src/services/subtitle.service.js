import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
})

export const getFileSubtitles = async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    const response = await http.post('/api/subtitles/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data; 
}

export const getYoutubeSubtitles = async (youtubeUrl) => {
    const response = await http.post('/api/subtitles/youtube', { youtubeUrl });
    return response.data;
}