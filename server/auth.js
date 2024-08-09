// auth.js
import express from 'express';
import getTableauToken from '../scripts/getToken.js';


const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    const username = req.body.email === "mky.kim@spc.co.kr" ? "insang.cho@spc.co.kr" : req.body.email;
    const tableauServerUrl = req.session.tableauServerUrl;
    
    if (!tableauServerUrl) {
        return res.status(400).json({ error: 'Tableau server URL not set in session.' });
    }


    const token = await getTableauToken(username, tableauServerUrl);
    if (token) {
        req.session.tableauToken = token;
        req.session.username = username;
        res.redirect('/select');
    } else {
        res.status(401).json({ error: '등록된 태블로 사용자가 아닙니다.' });
    }
});

// 선택한 브랜드를 세션에 저장
authRouter.post('/select', (req, res) => {
    const path = req.body.path;
    req.session.path = path;
    res.redirect('/dashboard');
});


authRouter.get('/selectPath', (req, res) => {
    if (req.session.path) {
        res.json({ path: req.session.path });
    } else {
        res.status(404).json({ error: 'path not found' });
    }
});




export default authRouter;
