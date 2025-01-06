import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import routes from './routes.js';
import authRouter from './auth.js';
import config from '../config/config.js';
import logger from '../config/logger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

const PRIVATE_IP_RANGES = [
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
    /^192\.168\.\d{1,3}\.\d{1,3}$/
];

function checkIfPrivateIP(ip) {
    return PRIVATE_IP_RANGES.some((regex) => regex.test(ip));
}

function ipCheckMiddleware(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.substr(0, 7) === "::ffff:") {
        ip = ip.substr(7);
    }

    req.session.tableauServerUrl = checkIfPrivateIP(ip) 
        ? config.tableauInternelServerUrl 
        : config.tableauServerUrl;

    next();
}

// Middleware setup
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(ipCheckMiddleware);

// Routes
app.use('/api', routes);
app.use('/auth', authRouter);

// Page routes
const sendFileIfAuthenticated = (filepath) => (req, res) => {
    if (!req.session.tableauToken) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'public', filepath));
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/select', sendFileIfAuthenticated('select.html'));
app.get('/dashboard', sendFileIfAuthenticated('dashboard.html'));

// Catch-all route
app.use((req, res) => {
    res.redirect('/');
});

// Start server
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
