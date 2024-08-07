import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import routes from './routes.js';
import authRouter from './auth.js';

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

// Routes
app.use('/api', routes);
app.use('/auth', authRouter);

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.tableauToken) {
        res.sendFile(path.join(__dirname, 'public', 'test.html'));
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
    console.log(`Server is running on http://localhost:${port}`);
});
