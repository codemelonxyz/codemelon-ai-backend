import authKeyModel from '../models/ai-auth-key.model.js';
import quotaModel from '../models/quota.model.js';

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
                const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                await authKeyModel.saveKey(key, userId);
                return res.status(201).json({ message: 'Key Generated', key: key });
            }
            return res.status(500).json({ message: 'Internal server error' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getKey(req, res) {
        const userId = req.authKey.id;
        const keyExist = await authKeyModel.searchKey(userId);
        if(keyExist.length === 0) {
            return res.status(404).json({ message: 'No key found', instruction: "Refer to https://codemelon.xyz/developers/ai" });
        }
        if (keyExist.length > 0) {
            return res.status(200).json({ message: 'Key Found', key: keyExist[0].auth_key });
        }
    }

    static async getRemainingQuota(req, res) {
        const userId = req.authKey.id;
        const keyExist = await authKeyModel.searchKey(userId);
        if(keyExist.length === 0) {
            return res.status(404).json({ message: 'No key found', instruction: "Refer to https://codemelon.xyz/developers/ai" });
        }
        if (keyExist.length > 0) {
            const remainingQuota = await quotaModel.getRemainingQuota(keyExist[0].auth_key);
            return res.status(200).json({ message: 'Remaining Quota', remaining_quota: remainingQuota });
        }
    }

    static async chat(req, res) {
        res.status(200).json({ message: 'Chat endpoint' });    
    }

}


export default generateKeyController;