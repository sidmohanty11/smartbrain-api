const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setting up Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const checkTheUser = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Unauthorized!");
    } 
    return res.json({ id: reply });
  })
};

const signToken = (email) => {
   const jwtPayload = { email };
   return jwt.sign(jwtPayload, process.env.JWT_SECRET);
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id));
}

const createSession = (data) => {
  // create a JWT token
  const { id, email } = data;
  const token = signToken(email);

  return setToken(token, id)
  .then(() => {
    return { success: 'true', user_id: id, token };
  })
  .catch(err => console.log(err));
}

const handleAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) : 
  checkTheUser(db, bcrypt, req, res)
    .then(data => {
      return data.id && data.email ? createSession(data) : Promise.reject("invalid credentials");
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json('unable to get user'));
}

module.exports = {
  handleAuthentication: handleAuthentication,
  redisClient: redisClient
}