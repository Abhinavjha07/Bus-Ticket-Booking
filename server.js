const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./controllers/users'); 
const ticket = require('./controllers/tickets');
const bcrypt = require('bcrypt');

var app = express();

app.use(bodyParser.json());
app.use('/users', users);
app.use('/tickets', ticket);

// let hash = bcrypt.hashSync('hyperverge', 10);
// console.log(hash);
mongoose.connect(
    process.env.DB_CONNECT || 'mongodb://localhost:27017/bus_reservation',
    { useNewUrlParser: true }
)
mongoose.connection
    .once('open', () => console.log('Connected to the database successfully'))
    .on('error', (error) => {
        console.warn('Error in connecting to database', error);
    });

app.listen(process.env.PORT || 3000, ()=> {
	console.log('Server started a port: 3000');
});








