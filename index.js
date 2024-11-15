import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverAuth from './middlewares/server.auth.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

// Global Middlewares //
app.use(express.json());
app.use(cors());
app.use(serverAuth);

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to codemelon ai",
        instruction: "Go to codemelon.xyz/developers/ai for more"
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});