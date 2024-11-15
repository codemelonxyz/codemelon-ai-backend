import { v4 as uuidv4 } from 'uuid';

class uuidServices {
    constructor() {
    }

    static async createToken() {
        return uuidv4()
    }


}

export default uuidServices;