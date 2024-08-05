import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.js';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();


// app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cache', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cacheIndex.html'));
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
