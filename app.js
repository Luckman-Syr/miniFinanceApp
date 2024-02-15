const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));

app.use(cookieParser())
app.listen(process.env.APP_PORT, () => {
    console.log(`Server started on ${process.env.APP_PORT}`);
});

//define routes
const userRoute = require('./routes/user.route');
const verifyRoute = require('./routes/verify.route');
const rekeningRoute = require('./routes/rekening.route');
const transactionRoute = require('./routes/transaction.route');

app.use('/api/v1/users', userRoute);
app.use('/api/v1/verify', verifyRoute);
app.use('/api/v1/rekening', rekeningRoute);
app.use('/api/v1/transaction', transactionRoute);

module.exports = app;