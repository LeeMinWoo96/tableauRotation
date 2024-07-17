import express from 'express';
import getTableauToken from '../scripts/getToken.js';
// const getTableauToken = require('../scripts/getToken');

const router = express.Router();

const urls = [
    'http://121.254.201.142/views/POS_NEW_2_17158490567760/POS?:showVizHome=no&:embed=true',
    'http://121.254.201.142/views/_BR_/BR?:showVizHome=no&:embed=true',
    'http://121.254.201.142/views/_DD_/DD?:showVizHome=no&:embed=true',
    'http://121.254.201.142/views/2/BR?:showVizHome=no&:embed=true'
];

let currentIndex = 0;

router.get('/rotate', async (req, res) => {
    currentIndex = (currentIndex + 1) % urls.length;
    const token = await getTableauToken();

    if (token) {
        const urlWithToken = `${urls[currentIndex]}&:tabs=n&:toolbar=n&:token=${token}`;
        res.json({ url: urlWithToken });
    } else {
        res.status(500).json({ error: 'Failed to get Tableau token' });
    }
});

export default router;
