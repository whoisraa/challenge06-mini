require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const router = require('./routes/router');
const user = require('./models/user');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router);
app.use('/api', user);

app.set('view engine', 'ejs');

const mongoURI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(`Internal server error`);
});

app.use((req, res) => {
    res.status(404).send(`Page not found`);
});

app.listen(port, () => console.log(`The server has started at http://localhost:${port}`));