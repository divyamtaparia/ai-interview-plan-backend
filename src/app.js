const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://ai-interview-plan-frontend.vercel.app',
    credentials: true
}));

/* require all routes here */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

/* use all routes here */
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;
