import aiServices from "../services/ai.services.js";
import quotaModel from "../models/quota.model.js";
import authKeyModel from "../models/ai-auth-key.model.js";
import promptServices from "../services/prompt.services.js";
import chatModel from "../models/ai-chat.model.js"; // Import the chat model

class chatCompletion {
  constructor() {}

  static async getQuestions(req, res) {
    const userId = req.authKey.id;
    const chatId = req.query.id;
    if (!chatId) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const keyExist = await authKeyModel.searchKey(userId);
    const { language, framework, uiLibrary, componentType } = req.body;
    if (keyExist.length === 0) {
      return res
        .status(404)
        .json({
          message: "No key found",
          instruction: "Refer to https://codemelon.xyz/developers/ai",
        });
    }
    if (keyExist.length > 0) {
      const remainingQuota = await quotaModel.getRemainingQuota(
        keyExist[0].auth_key
      );
      if (remainingQuota <= 0) {
        return res
          .status(403)
          .json({
            message: "Quota exceeded",
            instruction: "Refer to https://codemelon.xyz/developers/ai",
          });
      }
      const prompt = await promptServices.getQuestionsPrompt(
        language,
        framework,
        uiLibrary,
        componentType
      );
      const questions = await aiServices.getResponse(prompt);
      await quotaModel.updateQuota(
        keyExist[0].auth_key,
        remainingQuota - questions.tokens
      );
      await chatModel.addMessage(chatId, { user: prompt });
      await chatModel.addMessage(chatId, { watermelon: questions.response });
      return res.status(200).json({
        message: "Questions generated",
        remaining_quota: remainingQuota - questions.tokens,
        data: questions.response
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/\\/g, "")
          .replace("```", "")
          .replace("json", "")
          .replace("```", ""),
      });
    }
  }

  static async aiCompletion(req, res) {
    try {
        const userId = req.authKey.id;
        const chatId = req.query.id;
        const type = req.query.type;
        const message = req.body.message;

        if (!chatId || !type || !message) {
            return res.status(400).json({ message: "Bad Request All fields are required !" });
        }

        const keyExist = await authKeyModel.searchKey(userId);
        if (keyExist.length === 0) {
            return res.status(404).json({
                message: "No key found",
                instruction: "Refer to https://codemelon.xyz/developers/ai",
            });
        }

        const remainingQuota = await quotaModel.getRemainingQuota(keyExist[0].auth_key);
        if (remainingQuota <= 0) {
            return res.status(403).json({
                message: "Quota exceeded",
                instruction: "Refer to https://codemelon.xyz/developers/ai",
            });
        }

        if (type === "questionPrompt") {
            // Append user's answers to the chat
            // Assume message is an object with answers: { answer1: "...", answer2: "...", answer3: "..." }
            await chatModel.addMessage(chatId, { user: message });

            // Retrieve the entire chat history
            const chatHistory = await chatModel.getChatById(chatId);

            // Generate AI response using the chat history
            const aiResponse = await aiServices.getResponse(chatHistory);

            // Append AI response to the chat
            await chatModel.addMessage(chatId, { watermelon: aiResponse.response });

            // Update remaining quota
            await quotaModel.updateQuota(keyExist[0].auth_key, remainingQuota - aiResponse.tokens);

            return res.status(200).json({
                message: "AI response generated",
                remaining_quota: remainingQuota - aiResponse.tokens,
                data: aiResponse.response,
            });
        } else if (type === "codePrompt") {
          // Append user's prompt to the chat
          console.log(chatId, message)
            await chatModel.addMessage(chatId, { user: message });

            // Retrieve the entire chat history
            const chatHistory = await chatModel.getChatById(chatId);

          console.log(chatHistory)
            // Generate AI response using the chat history
            const aiResponse = await aiServices.getResponse(chatHistory);

            // Append AI response to the chat
          await chatModel.addMessage(chatId, { watermelon: aiResponse.response });
          console.log(aiResponse.response)

            // Update remaining quota
            await quotaModel.updateQuota(keyExist[0].auth_key, remainingQuota - aiResponse.tokens);

            return res.status(200).json({
                message: "AI response generated",
                remaining_quota: remainingQuota - aiResponse.tokens,
                data: aiResponse.response,
            });
        } else {
            return res.status(400).json({ message: "Invalid type" });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            instruction: "Please try again later",
        });
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
