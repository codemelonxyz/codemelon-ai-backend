import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class jwtServices {
    constructor() {

    }

    static async generateTempToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
    }

    static async verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    static async decodeToken(token) {
        return jwt.decode(token);
    }

    static async generatePermamentToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET);
    }

    static async generateToken(payload, expiresIn) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    }

    static async generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    }

    static async verifyRefreshToken(token) {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    }

    static async decodeRefreshToken(token) {
        return jwt.decode(token);
    }

}


export default jwtServices;