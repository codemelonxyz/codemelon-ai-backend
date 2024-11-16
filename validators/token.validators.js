import jwtFunc from '../services/jwt.services.js';

class TokenValidators {
    constructor() {
    }

    static async validateToken(req, res, next) {
        try {
            if (!req.header('Authorization')) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = req.header('Authorization').replace('Bearer ', '');
            const userExist = await jwtFunc.verifyToken(token);
            if (!userExist) {
                return res.status(401).send({ message: 'Unauthorized' });
            }
            const user = await jwtFunc.decodeToken(token);

            req.authKey = user;
            next();
        } catch (err) {
            return res.status(500).json({ message: 'Corrupted token found' });
        }
    }
}

export default TokenValidators;