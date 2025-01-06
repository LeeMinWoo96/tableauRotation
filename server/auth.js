// auth.js
import express from 'express';
import getTableauToken from '../scripts/getToken.js';
import logger from '../config/logger.js';
import { getAllowedUsers } from '../services/authService.js';

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    const username = req.body.email;
    const tableauServerUrl = req.session.tableauServerUrl;
    
    if (!tableauServerUrl) {
        return res.status(400).json({ error: 'Tableau server URL not set in session.' });
    }

    try {
        const allowedUsers = await getAllowedUsers();
        
        if (!allowedUsers.includes(username)) {
            logger.error(`Block user login: ${username}`);
            return res.status(400).json({ error: '접근 허용되지 않은 계정입니다.' });
        }
        
        const token = await getTableauToken(username, tableauServerUrl);
        if (!token) {
            return res.status(401).json({ error: '등록된 태블로 사용자가 아닙니다.' });
        }
        
        req.session.tableauToken = token;
        req.session.username = username;
        res.redirect('/select');
    } catch (error) {
        logger.error(`Login error: ${error.message}`);
        res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다.' });
    }
});

authRouter.post('/select', (req, res) => {
    req.session.path = req.body.path;
    res.redirect('/dashboard');
});

authRouter.get('/selectPath', (req, res) => {
    if (!req.session.path) {
        return res.status(404).json({ error: 'Path not found' });
    }
    res.json({ path: req.session.path });
});

export default authRouter;
