import tokenValidator from "../validators/token.validators.js";
import generateKey from "../controllers/ai.code.controllor.js";
import express from "express";

const router = express.Router();

router.get('/ai/code/generate-key', tokenValidator.validateToken, generateKey.generateKey);
router.get('/ai/code/get-key', tokenValidator.validateToken, generateKey.getKey);
router.get('/ai/code/get-remaining-quota', tokenValidator.validateToken, generateKey.getRemainingQuota);
router.get('/ai/code/chat', tokenValidator.validateToken, generateKey.chat);

export default router;