import tokenValidator from "../validators/token.validators.js";
import generateKey from "../controllers/ai.code.controllor.js";
import express from "express";

const router = express.Router();

router.get('/', tokenValidator.validateToken, generateKey.generateKey);

export default router;