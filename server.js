const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')

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

initializeRoutes({
    app,
    routes
})

app.listen(PORT, () => console.log(`Server Running On Port *${PORT}`))