const express = require('express');
const { logout, signInWithEmailAndPassword, checkSession } = require('../../controllers/auth/auth.controller');
const authRouter = express.Router();

authRouter.post('/login', signInWithEmailAndPassword);
authRouter.post('/session', checkSession);
authRouter.post('/logout', logout);

module.exports = authRouter;