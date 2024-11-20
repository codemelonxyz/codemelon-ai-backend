
import quotaModel from "../models/quota.model.js";
import authKeyModel from "../models/ai-auth-key.model.js";
import aiChatModel from "../models/ai-chat.model.js";
import uuidServices from "../services/uuid.services.js";


class chatController {
    constructor() {
    }


    static async getChatById(req, res) {
        try {
            const auth_key = await authKeyModel.searchKey(req.authKey.id);
            const chat_id = req.query.id;
            if (!chat_id) {
                return res.status(400).json({ message: 'Bad Request' });
            }
            const chat = await aiChatModel.getChatById(chat_id, auth_key[0].auth_key);
            if (chat) {
                return res.status(200).json({ message: 'Chat', chat: chat });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async createChat(req, res) {
        try {
            const auth_key = await authKeyModel.searchKey(req.authKey.id);
            const numberOfPreviousChats = await aiChatModel.getUserChat(auth_key[0].auth_key);
            console.log(numberOfPreviousChats);
            if (numberOfPreviousChats != null && numberOfPreviousChats.length >= 10) {
                return res.status(400).json({ message: 'Maximum chat limit reached', instruction: "Delete previous chats to create more chats" });
            }

            const chatId = await uuidServices.createToken();
            const chatCreated = await aiChatModel.createChat(chatId, auth_key[0].auth_key);
            if (chatCreated) {
                return res.status(201).json({ message: 'Chat created', chat_id: chatId });
            }
            return res.status(500).json({ message: 'Internal server error' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async addMessage(chat_id) {
        return true;
    }

    static async chat(req, res) {
        try {
            const userId = req.authKey.id;
            const keyExist = await authKeyModel.searchKey(userId);
            if(keyExist.length === 0) {
                return res.status(404).json({ message: 'No key found', instruction: "Refer to https://codemelon.xyz/developers/ai" });
            }
            if (keyExist.length > 0) {
                const remainingQuota = await quotaModel.getRemainingQuota(keyExist[0].auth_key);
                if (remainingQuota <= 0) {
                    return res.status(403).json({ message: 'Quota exceeded', instruction: "Refer to https://codemelon.xyz/developers/ai" });
                }

                const chat_id = req.headers.chat_id;
                const message = req.body.message;

                if (!chat_id || !message) {
                    return res.status(400).json({ message: 'Bad Request' });
                }

                const addMessage = await this.addMessage(chat_id);
                if (addMessage) {
                    const remainingQuota = await quotaModel.getRemainingQuota(keyExist[0].auth_key);
                    return res.status(200).json({ message: 'Message added', remaining_quota: remainingQuota });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteChat(req, res) {
        try {
            const id = req.query.id;
            const userId = req.authKey.id;
            const keyExist = await authKeyModel.searchKey(userId);
            if(keyExist.length === 0) {
                return res.status(404).json({ message: 'No key found', instruction: "Refer to https://codemelon.xyz/developers/ai" });
            }
            if (!id) {
                return res.status(400).json({ message: 'Bad Request' });
            }
            const status = await aiChatModel.deleteChat(id, keyExist[0].auth_key);
            console.log(status);
            if (status) {
                return res.status(200).json({ message: 'Chat deleted' });
            }
            return res.status(400).json({ message: "Either Chat not found Or You don't have enough permission" });
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    static async getUserChats(req, res) {
        try {
            const userId = req.authKey.id;
            const keyExist = await authKeyModel.searchKey(userId);
            if(keyExist.length === 0) {
                return res.status(404).json({ message: 'No key found', instruction: "Refer to https://codemelon.xyz/developers/ai" });
            }
            const chats = await aiChatModel.getUserChat(keyExist[0].auth_key);
            if (chats) {
                return res.status(200).json({ message: 'Chats', chats: chats });
            }
            return res.status(500).json({ message: 'Internal server error' });
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default chatController;