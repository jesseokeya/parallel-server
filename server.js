require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require("mongoose");

const routes = require('./routes')

const {
    initializeRoutes
} = require('./util')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    throw err;
});

initializeRoutes({
    app,
    routes
})

app.listen(PORT, () => console.log(`Server Running On Port *${PORT}`))