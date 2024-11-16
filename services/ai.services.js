import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


class aiServices {
    constructor() {
    }

    static async getResponse(message) {
        const models = [
            process.env.AI_URL2,
            process.env.AI_URL,
            process.env.AI_URL3,
            process.env.AI_URL4,
        ];

        const apiKeys = [
            process.env.AI_API_KEY1,
            process.env.AI_API_KEY2,
            process.env.AI_API_KEY3
        ];

        for (let modelUrl of models) {
            for (let apiKey of apiKeys) {
                try {
                    const response = await this.callApi(modelUrl, apiKey, message);
                    return response;
                } catch (error) {
                    if (this.isQuotaExceeded(error)) {
                        continue;
                    } else if (this.isModelBusy(error)) {
                        break;
                    } else {
                        continue;
                    }
                }
            }
        }

        // console.log('All models are busy or quota exceeded.');
        throw new Error("All models are busy or quota exceeded. Please check back later.");
    }

    static async callApi(url, apiKey, message) {
        try {
            const response = await axios.post(
                `${url}key=${apiKey}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: JSON.stringify({ system: process.env.SYSTEM_PROMPT, user: message })
                                }
                            ]
                        }
                    ]
                }
            );
            return { response: response.data.candidates[0].content.parts[0].text, tokens: response.data.usageMetadata.candidatesTokenCount };
        } catch (error) {
            throw error;
        }
    }

    static isQuotaExceeded(error) {
        if (error.response && error.response.status === 429) {
            return true;
        }
        return false;
    }

    static isModelBusy(error) {
        if (error.response && error.response.status === 503) {
            return true;
        }
        return false;
    }
}

export default aiServices;