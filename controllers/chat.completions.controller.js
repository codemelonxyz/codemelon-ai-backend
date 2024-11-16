import aiServices from '../services/ai.services.js';
import quotaModel from '../models/quota.model.js';
import authKeyModel from '../models/ai-auth-key.model.js';
import promptServices from '../services/prompt.services.js';
import chatModel from '../models/ai-chat.model.js'; // Import the chat model

class chatCompletion{

    constructor() {
        
    }


    static async getQuestions(req, res) {
        const userId = req.authKey.id;
        const chatId = req.query.id;
        const keyExist = await authKeyModel.searchKey(userId);
        const { language, framework, uiLibrary, componentType } = req.body;
        if(keyExist.length === 0) {
            return res.status(404).json({ message: 'No key found', instruction: "Refer to https://codemelon.xyz/developers/ai" });
        }
        if (keyExist.length > 0) {
            const remainingQuota = await quotaModel.getRemainingQuota(keyExist[0].auth_key);
            if (remainingQuota <= 0) {
                return res.status(403).json({ message: 'Quota exceeded', instruction: "Refer to https://codemelon.xyz/developers/ai" });
            }
            const prompt = await promptServices.getQuestionsPrompt(language, framework, uiLibrary, componentType);
            const questions = await aiServices.getResponse(prompt);
            await quotaModel.updateQuota(keyExist[0].auth_key, remainingQuota - questions.tokens);
            await chatModel.addMessage(chatId, { user: prompt });
            await chatModel.addMessage(chatId, { watermelon: questions.response });
            return res.status(200).json({ message: 'Questions generated', remaining_quota: remainingQuota - questions.tokens , data: questions.response.replace(/(\r\n|\n|\r)/gm, "").replace(/\\/g, "").replace("```", "").replace("json", "").replace("```", "") });
        }
    }

    static async aiCompletion(req, res) {
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

                const addMessage = await this.addMessage(chat_id, message); // Pass necessary parameters
                if (addMessage) {
                    const remainingQuotaUpdated = await quotaModel.getRemainingQuota(keyExist[0].auth_key);
                    const aiResponse = await aiServices.getResponse(message);
                    return res.status(200).json({ message: 'Message added', remaining_quota: remainingQuotaUpdated, data: aiResponse });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error', instruction: "Please try again later" });   
        }
    }

    // Added addMessage method
    static async addMessage(chat_id, message) {
        try {
            const success = await chatModel.addMessage(chat_id, message);
            return success;
        } catch (error) {
            console.error("Error adding message:", error);
            return false;
        }
    }

}


export default chatCompletion;