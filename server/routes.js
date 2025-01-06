import express from 'express';
import getTableauToken from '../scripts/getToken.js';
import { getUrlsForPath, getPaths } from '../services/urlService.js';
import logger from '../config/logger.js';

const router = express.Router();

router.get('/urls/:path', async (req, res) => {
    const { path } = req.params;
    const { tableauToken, tableauServerUrl, username } = req.session;

    if (!tableauToken) {
        return res.status(401).json({ error: 'Authentication required' });
    }
  
    try {
        const urls = await getUrlsForPath(path, tableauServerUrl);
        const token = await getTableauToken(username, tableauServerUrl);
        const resolvedUrls = urls.map(url => url.replace(':token', token));
        res.json({ urls: resolvedUrls });
    } catch (error) {
        logger.error(`URL resolution error: ${error.message}`);
        res.status(500).json({ error: 'Failed to resolve URLs' });
    }
});
  
router.get('/url-sizes/:path', async (req, res) => {
    const { path } = req.params;
    const { tableauServerUrl } = req.session;

    try {
        const urls = await getUrlsForPath(path, tableauServerUrl);
        res.json({ size: urls.length });
    } catch (error) {
        logger.error(`URL size error: ${error.message}`);
        res.status(500).json({ error: 'Failed to get URL sizes' });
    }
});

router.get('/paths', async (req, res) => {
    try {
        const paths = await getPaths();
        res.json({ paths });
    } catch (error) {
        logger.error(`Paths error: ${error.message}`);
        res.status(500).json({ error: 'Failed to get paths' });
    }
});

export default router;
