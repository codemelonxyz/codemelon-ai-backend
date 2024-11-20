
import pool from "../config/db.config.js";

class chatModel {
    constructor() {
    }

    static async createChat(auth_key) {
        try {
            const query = "INSERT INTO code_chat_data (data, auth_key) VALUES (?, ?)";
            const values = [JSON.stringify([]), auth_key];
            await pool.query(query, values);
            return true;
        } catch (err) {
            return false;
        }
    }

    // ...existing code...
}

export default chatModel;