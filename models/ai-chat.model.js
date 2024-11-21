import pool from "../config/db.config.js";

class chatModel {
    constructor() {
        
    }

    static async getChatById(chat_id, auth_key) {
        try {
            const query = "SELECT * FROM code_chat_data WHERE id = ? AND auth_key = ?";
            const values = [chat_id, auth_key];
            const [rows] = await pool.query(query, values);
            return rows[0];
        } catch (err) {
            return null;
        }
    }

    static async getUserChat(auth_key) {
        try {
            const query = "SELECT id FROM code_chat_data WHERE auth_key = ?";
            const values = [auth_key];
            const [rows] = await pool.query(query, values);
            return rows;
        } catch (err) {
            return null;
        }
    }

    static async deleteChat(chat_id, auth_key) {
        try {
            const query = "DELETE FROM code_chat_data WHERE id = ? AND auth_key = ?";
            const values = [chat_id, auth_key];
            const deleted = await pool.query(query, values);
            if (deleted[0].affectedRows === 0) {
                return false;
            }
            return true;
        } catch (err) {
            return false;
        }
    }

     static async createChat(chat_id, auth_key) {
        try {
            const query = "INSERT INTO code_chat_data (id, data, auth_key) VALUES (?, ?, ?)";
            const values = [ chat_id ,JSON.stringify([]), auth_key];
            await pool.query(query, values);
            return true;
        } catch (err) {
            return false;
        }
    }

    static async addMessage(chat_id, message) {
        try {
            console.log(chat_id, message);
            const query = "SELECT * from code_chat_data WHERE id = ?";
            const [rows] = await pool.query(query, [chat_id]);

            let data;
            if (typeof rows[0]?.data === 'string') {
                data = rows[0].data ? JSON.parse(rows[0].data) : [];
            } else if (typeof rows[0]?.data === 'object') {
                data = rows[0].data || [];
            } else {
                data = [];
            }

            data.push(message);
            console.log(data);

            const updateQuery = "UPDATE code_chat_data SET data = ? WHERE id = ?";
            const dataToStore = JSON.stringify(data);
            await pool.query(updateQuery, [dataToStore, chat_id]);

            return true;
        } catch (err) {
            console.error("Error in addMessage:", err);
            return false;
        }
    }
}

export default chatModel;