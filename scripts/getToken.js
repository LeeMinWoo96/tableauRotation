// getToken.js
import axios from 'axios';
import config from '../config/config.js';

const { tableauServerUrl } = config;

const getTableauToken = async (username) => {
    const trustedAuthUrl = `${tableauServerUrl}/trusted`;
    try {
        const response = await axios.post(trustedAuthUrl, null, {
            params: { username },
        });
        const token = response.data;
        if (token == '-1') {
            console.error('Failed to get Tableau token');
            return null;
        } else {
            console.debug('Tableau token:', token);
            return token;
        }
    } catch (error) {
        console.error('Error getting Tableau token:', error);
        return null;
    }
};

export default getTableauToken;
