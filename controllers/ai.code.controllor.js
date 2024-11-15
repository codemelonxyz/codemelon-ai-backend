import authKeyModel from '../models/ai-auth-key.model.js';

class generateKeyController {
    constructor() {
    }
    static async generateKey(req, res) {
        try {
            const userId = req.authKey.id;
            const keyExist = await authKeyModel.searchKey(userId);
            if (keyExist.length > 0) {
                return res.status(400).json({ message: 'User Already Exist' });
            }
            if (keyExist.length === 0) {
                const key = await Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                await authKeyModel.saveKey(key, userId);
                return res.status(201).json({ message: 'Key Generated', key: key });
            }
            return res.status(500).json({ message: 'Internal server error' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default generateKeyController;