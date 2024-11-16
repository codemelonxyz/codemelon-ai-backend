import pool from "../config/db.config.js";

class quotaModel {
    constructor() {
    }

    static async createTodaysToken(api_key) {
        try {
            const query = "INSERT INTO api_quota (api_key, remaining_token) VALUES (?, ?)";
            const values = [api_key, 2000];
            await pool.query(query, values);
            return true;
        } catch (err) {
            return false;
        }
    }

    static async checkQuota(api_key) {
        const query = "SELECT * FROM api_quota WHERE api_key = ? AND DATE(created_at) = CURRENT_DATE";
        const values = [api_key];
        const [rows] = await pool.query(query, values); 
        return rows;
    }

    static async getRemainingQuota(api_key) {
        const checkQuota = await this.checkQuota(api_key);
        if (checkQuota.length === 0) {
            await this.createTodaysToken(api_key);
            return 2000;
        } else {
            return checkQuota[0].remaining_token;
        }
    }

    static async updateQuota(api_key, remaining_token) {
        try {
            const query = "UPDATE api_quota SET remaining_token = ? WHERE api_key = ? AND DATE(created_at) = CURRENT_DATE";
            const values = [remaining_token, api_key];
            await pool.query(query, values);
            return true;
        } catch (err) {
            return false;
        }
    }

}

export default quotaModel;