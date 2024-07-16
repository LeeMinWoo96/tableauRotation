import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
