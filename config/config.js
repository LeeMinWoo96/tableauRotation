import dotenv from 'dotenv';
dotenv.config();

const config = {
    tableauServerUrl: process.env.TABLEAU_SERVER_URL,
    tableauInternelServerUrl : process.env.TABLEAU_INTERNEL_SERVER_URL,
    username: process.env.TABLEAU_USERNAME,
};

export default config;
