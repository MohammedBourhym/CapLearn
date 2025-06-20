import express from "express";
import cors from "cors";
import subtitlesRouter from './routes/subtitles.routes.js';
import fs from 'fs';

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use('/api/subtitles', subtitlesRouter);

app.get("/", (req, res) => {
    res.json({ message: "My bruda" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});