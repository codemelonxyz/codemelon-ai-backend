import dotenv from 'dotenv';
dotenv.config();

class promptServices{
    constructor() {

    }

    static async getQuestionsPrompt(language, framework, uiLibrary, component ) {
        const prompt = `
          the user wants to create and manage a ${component} in a ${framework} ${language} project using ${uiLibrary} as the UI library can you generate some question to ask user so that you can make the best ${component} for them please make sure the questions generated are relevant to the ${component} and the ${uiLibrary} library and also are properly structured in a parsable json format with keys as question1, 2, 3 and their values as the questions only generate the json nothing else should be generated
        `
        return prompt;
    }
    
}



export default promptServices;