import express from "express";
import cors from "cors";
import fs from "fs";
import subtitlesRouter from './routes/subtitles.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: "*", // Update this to match your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "CapLearn API is running" });
});

// Mount subtitles router
app.use('/api/subtitles', subtitlesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});