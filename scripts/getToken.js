// getToken.js
import axios from 'axios';
import config from '../config/config.js';
import logger from '../config/logger.js';

// const { tableauServerUrl } = config;

const getTableauToken = async (username, tableauServerUrl) => {
    const trustedAuthUrl = `${tableauServerUrl}/trusted`;
    try {
        const response = await axios.post(trustedAuthUrl, null, {
            params: { username },
        });
        const token = response.data;
        if (token == '-1') {
            logger.error('Failed to get Tableau token');
            return null;
        } else {
            logger.info(`Tableau username: ${username} token: ${token}`);
            return token;
        }
    } catch (error) {
        logger.error('Error getting Tableau token:', error);
        return null;
    }
};

export default getTableauToken;
