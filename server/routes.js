import express from 'express';
import getTableauToken from '../scripts/getToken.js';
// const getTableauToken = require('../scripts/getToken');

const router = express.Router();

const urls = [
    'http://10.0.50.185/trusted/:token/views/POS_NEW_2_17158490567760/POS?:embed=yes&:showVizHome=no&:toolbar=no',
    'http://10.0.50.185/trusted/:token/views/_BR_/BR?:embed=yes&:showVizHome=no&:toolbar=no',
    'http://10.0.50.185/trusted/:token/views/_DD_/DD?:embed=yes&:showVizHome=no&:toolbar=no',
    'http://10.0.50.185/trusted/:token/views/2/BR?:embed=yes&:showVizHome=no&:toolbar=no'
];

// 미사용 
let currentIndex = 0;
router.get('/rotate', async (req, res) => {
    const token = await getTableauToken();

    if (token == -1) {
        res.status(500).json({ error: 'Failed to get Tableau token' });
        return;
    }

    const url = `${urls[currentIndex]}`.replace(':token', token);
    currentIndex = (currentIndex + 1) % urls.length;
    
    console.debug(url)
    res.json({ url });
});


// router.get('/urls', async (req, res) => {
//     try {
//         const resolvedUrls = await Promise.all(urls.map(async url => {
//             const token = await getTableauToken();

//             if (token == -1) {
//                 throw new Error('Failed to get Tableau token');
//             }

//             return url.replace(':token', token);
//         }));

//         res.json({ urls: resolvedUrls });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// Return URLs with token replaced from session
router.get('/urls', async (req, res) => {
    const token = req.session.tableauToken;  // Retrieve token from session
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        const resolvedUrls = await Promise.all(urls.map(
            async url => {
                const token = await getTableauToken(req.session.username);
                // url.replace(':token', token)
                return url.replace(':token', token);
            }
        ));
        console.log(resolvedUrls)
        res.json({ urls: resolvedUrls });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve URLs' });
    }
});

router.get('/url-sizes', async (req, res) => {
    console.debug("size ",urls.length)
    res.json({ size : urls.length });
});
    

export default router;
