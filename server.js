require('dotenv').config();
const express = require('express');
const { json } = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/auth');

const db = knex({
  // connect to your own database here
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();

app.use(cors())
app.use(json());
app.use(morgan('dev'));

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.handleAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.handleAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.handleAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.handleAuth, (req, res) => { image.handleApiCall(req, res)})

app.listen(8000, ()=> {
  console.log('app is running on port 8000');
})
