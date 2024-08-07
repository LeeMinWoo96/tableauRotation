import express from 'express';
import getTableauToken from '../scripts/getToken.js';

const authRouter = express.Router();


authRouter.post('/login', async (req, res) => {
    console.log(req.body)
    const username = req.body.email;
    const token = await getTableauToken(username);
    if (token) {
        req.session.tableauToken = token;
        req.session.username = username;
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ error: '등록된 태블로 사용자가 아닙니다.' });
    }
});

export default authRouter;
