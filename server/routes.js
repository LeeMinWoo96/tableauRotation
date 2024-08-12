import express from 'express';
import getTableauToken from '../scripts/getToken.js';
import { getUrlsForPath, getPaths } from '../services/urlService.js';


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
                const token = await getTableauToken(req.session.username,req.session.tableauServerUrl);
                // url.replace(':token', token)
                return url.replace(':token', token);
            }
        ));
        // console.log(resolvedUrls)
        res.json({ urls: resolvedUrls });
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve URLs' });
    }
});



router.get('/url-sizes', async (req, res) => {
    logger.debug("size ",urls.length)
    res.json({ size : urls.length });
});
    


router.get('/urls/:path', async (req, res) => {
    const { path } = req.params;
    const token = req.session.tableauToken;
    const tableauServerUrl = req.session.tableauServerUrl;
    if (!token) {
      return res.status(401).json({ error: 'AUTHENTICATION REQUIRED' });
    }
  
    try {
      const urls = await getUrlsForPath(path,tableauServerUrl);
      const resolvedUrls = await Promise.all(urls.map(
        async url => {
          const token = await getTableauToken(req.session.username, req.session.tableauServerUrl);
        //   console.debug(token);
          
          return url.replace(':token', token);
        }
      ));
      res.json({ urls: resolvedUrls });
      
    } catch (error) {
      res.status(500).json({ error: 'FAILED TO RESOLVE URLS' });
    }
  });
  
  router.get('/url-sizes/:path', async (req, res) => {
    const { path } = req.params;
    const tableauServerUrl = req.session.tableauServerUrl;
    try {
      const urls = await getUrlsForPath(path,tableauServerUrl);
      res.json({ size: urls.length });
    } catch (error) {
      res.status(500).json({ error: 'FAILED TO GET URL SIZES' });
    }
  });

  router.get('/paths', async (req, res) => {
    // try {
        
        const paths = await getPaths();
        // console.log(paths)
        res.json({ paths });
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to get paths' });
    // }
});

export default router;
