// Libraries
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const compression = require('compression'); // Compress files when sending them to the customer
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fallback = require('express-history-api-fallback');
require('dotenv').config();

// Routes
const apiRouter = require('./routes/api/api.router');
const authRouter = require('./routes/auth/auth.router');
const { checkUserAuth } = require('./routes/auth/auth.utils');
const app = express();


app.use(helmet({
  contentSecurityPolicy: false,
}));

// Allows us to use client and server concurrently
if (process?.env?.NODE_ENV === 'development') {
  // Accept requests from other sources
  app.use(cors({
    origin: 'http://localhost:3000',
  }))
} else {
  app.use(cors());
}

// Transforms incoming requests with JSON type data
app.use(express.json({ limit: '50mb' })); // We changed the limit to be able to get tens of thousands of JSON data, such as payments.
// Transforms incoming requests with Form type data
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload()); // Middleware used to receive media sent by the form from the client. Ex: Photos

// We create a session for the logged in user and store the data in a Cookie on the client.
app.use(cookieParser(process.env.COOKIE_SESSION_SECRET))

app.use(compression()); // Send the files to the client compressed

// Routes
app.use('/api', checkUserAuth, apiRouter);
app.use('/auth', authRouter); // Session and User Log

// Send the Front End to each endpoint
const root = path.join(__dirname, '..', 'public'); // Path to the Build folder made by React
app.use(express.static(root));
app.use(fallback('index.html', { root }));

module.exports = app;
