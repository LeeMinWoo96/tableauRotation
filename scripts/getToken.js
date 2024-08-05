import axios from 'axios';
import config from '../config/config.js';

const { tableauServerUrl, username } = config;
const trustedAuthUrl = `${tableauServerUrl}/trusted`;

const getTableauToken = async () => {
    try {
        const response = await axios.post(trustedAuthUrl, null, {
            params: {
                username: username,
            },
        });

        const token = response.data;

        if (token == '-1') {
            console.error('Failed to get Tableau token');
            
            // console.error(response)
        } else {
            console.log('Tableau token:', token);
            return token
        }
    } catch (error) {
        console.error('Error getting Tableau token:', error);
    }
    
};

export default getTableauToken;
