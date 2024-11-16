import tokenValidator from "../validators/token.validators.js";
import generateKey from "../controllers/ai.code.controllor.js";
import chatController from "../controllers/chat.code.controller.js";
import chatCompletion from "../controllers/chat.completions.controller.js";
import express from "express";

const router = express.Router();

router.get('/ai/code/generate-key', tokenValidator.validateToken, generateKey.generateKey);
router.get('/ai/code/get-key', tokenValidator.validateToken, generateKey.getKey);
router.get('/ai/code/get-remaining-quota', tokenValidator.validateToken, generateKey.getRemainingQuota);
router.get('/ai/code/chat/create', tokenValidator.validateToken, chatController.createChat);
router.get('/ai/code/chat', tokenValidator.validateToken, chatController.chat);
router.get('/ai/code/chats', tokenValidator.validateToken, chatController.getUserChats);
router.delete('/ai/code/chat/delete', tokenValidator.validateToken, chatController.deleteChat);

// Code completion routes
router.post('/ai/code/chat/completion', tokenValidator.validateToken, chatCompletion.aiCompletion);
router.post('/ai/code/chat/getQuestions', tokenValidator.validateToken, chatCompletion.getQuestions);

export default router;