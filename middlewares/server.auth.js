import dotenv from 'dotenv';
dotenv.config();

export default async (req, res, next) => {
    const { server_key } = req.headers;

    if (!server_key) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized',
            err: 'SERVER_KEY is required'
        });
    }
    if (server_key !== process.env.SERVER_KEY) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized',
            err: 'Invalid SERVER_KEY'
        });
    }
    next();
};