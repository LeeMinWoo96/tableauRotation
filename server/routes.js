import express from 'express';
import getTableauToken from '../scripts/getToken.js';
// const getTableauToken = require('../scripts/getToken');

const router = express.Router();

const urls = [
    // 'https://public.tableau.com/views/Superstore_embedded_800x800/Overview',
    'http://121.254.201.144/trusted/:token/views/POS_NEW_2_17158490567760/POS?:embed=yes&:iid=2',
    // 'http://121.254.201.144/trusted/:token/t/2d8bafac-9006-4c28-ba08-28b3c02c9c41/views/POS_NEW_2_17158490567760/POS?:iid=2',
    // 'http://121.254.201.144/trusted/:token/t/121.254.201.144/views/POS_NEW_2_17158490567760/POS?:iid=2'
    // 'http://121.254.201.144/trusted/:token/t/views/2d8bafac-9006-4c28-ba08-28b3c02c9c41/POS_NEW_2_17158490567760/POS?:iid=2'
    'http://121.254.201.144/trusted/:token/views/_BR_/BR?:embed=yes',
    // 'http://121.254.201.144/trusted/:token/views/_BR_/BR?:showVizHome=no&:embed=yes'
    // 'http://121.254.201.142/views/_DD_/DD?:showVizHome=no&:embed=true',
    // 'http://121.254.201.142/views/2/BR?:showVizHome=no&:embed=true'
];
// http://<server_name>/trusted/<unique_ticket>/views/<workbook_name>/<view_name> 
// http://<server_name/trusted/<unique_ticket>/t/Sales/views/<workbook_name>/<view_name> 


// const testUrls = [
//     'http://121.254.201.142/trusted/:token/views/_BR_/BR?:embed=yes'
// ];

let currentIndex = 0;
// let usingTestUrls = false;

router.get('/rotate', async (req, res) => {
    const token = await getTableauToken();

    if (token == -1) {
        res.status(500).json({ error: 'Failed to get Tableau token' });
        return;
    }

    // let url;
    // if (!usingTestUrls) {
    
    // const url = `${urls[currentIndex]}&:tabs=n&:toolbar=n&:token=${token}`;
    const url = `${urls[currentIndex]}`.replace(':token', token);
    currentIndex = (currentIndex + 1) % urls.length;
    
        // if (currentIndex === 0) {
            // usingTestUrls = true;
        // }
    // } else {
    // url = testUrls[0].replace(':token', token);
    // usingTestUrls = false;
    // }
    console.log(url)
    res.json({ url });
});

export default router;
