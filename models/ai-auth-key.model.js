import pool from "../config/db.config.js";

class authKeyModel {
    constructor(){        
    }
    static async searchKey(userId){
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.execute('SELECT * FROM ai_auth_keys WHERE user_id = ?', [userId]);
            return rows;
        } catch (error) {
            console.log(error);
            return null;
        } finally {
            if (connection) connection.release();
        }
    }

    static async saveKey(key, userId){
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.execute('INSERT INTO ai_auth_keys (user_id, auth_key) VALUES (?, ?)', [userId, key]);
            return rows;
        } catch (error) {
            console.log(error);
            return null;
        } finally {
            if (connection) connection.release();
        }
    }
}

export default authKeyModel;