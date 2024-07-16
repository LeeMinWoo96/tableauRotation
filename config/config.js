import dotenv from 'dotenv';
dotenv.config();

const config = {
    tableauServerUrl: process.env.TABLEAU_SERVER_URL,
    username: process.env.TABLEAU_USERNAME,
};

export default config;
