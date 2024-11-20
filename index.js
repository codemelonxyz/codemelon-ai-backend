import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverAuth from './middlewares/server.auth.js';
import generateKeyRoutes from './routes/ai.code.routes.js';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
// Global Middlewares //
app.use(express.json());
// app.use(serverAuth);

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to codemelon ai",
        instruction: "Go to codemelon.xyz/developers/ai for more"
    })
});

app.use('/api/v1', generateKeyRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
