
const express = require('express');
const mongoose = require('mongoose');
const stuRoute = require('./routes/route.js');
const auth = require('./controllers/auth.js');
const errorHandler = require('./middlwares/error handel.js');
const app = express();
const port = 3000;


app.use(express.json());


mongoose.connect('mongodb://localhost:27017/student')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('connection',err));

    app.use('/api',stuRoute);
    app.use('/api',authe);
    app.use(errorHandler);
    
app.listen(3000,  console.log(`listening on port 3000`));


