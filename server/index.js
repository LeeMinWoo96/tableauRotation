import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import routes from './routes.js';
import authRouter from './auth.js';
import config from '../config/config.js';
import logger from '../config/logger.js';

const { tableauServerUrl,tableauInternelServerUrl } = config;

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

// Static files
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Body parser for forms
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'secret', // Change this secret to a random string in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

function checkIfPrivateIP(ip) {
    const privateRanges = [
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
        /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
        /^192\.168\.\d{1,3}\.\d{1,3}$/
    ];
    return privateRanges.some((regex) => regex.test(ip));
}

function ipCheckMiddleware(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Express에서 IP 주소를 추출할 때 IPv6 형식으로 나올 수 있으므로 처리
    if (ip.substr(0, 7) === "::ffff:") {
        ip = ip.substr(7)
    }

    if (checkIfPrivateIP(ip)) {
        // console.debug("Access from Private IP:", ip);
        req.session.tableauServerUrl = tableauInternelServerUrl  // 하드코딩할까나
        // 사설 IP에서 접근한 경우의 설정
    } else {
        // console.debug("Access from Public IP:", ip);
        // 공인 IP에서 접근한 경우의 설정
        req.session.tableauServerUrl = tableauServerUrl
    }

    next();
};

app.use(ipCheckMiddleware);

// Routes
app.use('/api', routes);
app.use('/auth', authRouter);

// Home page
app.get('/',(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Select page
app.get('/select', (req, res) => {
    if (req.session.tableauToken) {
        res.sendFile(path.join(__dirname, 'public', 'select.html'));
    } else {
        res.redirect('/');
    }
});

// Dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.tableauToken) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Handle all other requests and redirect to login page
app.use((req, res) => {
    res.redirect('/');
});

// Start server
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
    // console.log(`Server is running on http://localhost:${port}`);
});
