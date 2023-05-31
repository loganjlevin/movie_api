const jwt = require('jsonwebtoken'),
  passport = require('passport'),
  { JWT_SECRET } = require('./config');

require('./passport');

/**
 * This function creates JWT based on username and secret
 * @function generateJWTToken
 * @param {object} user - received after checking the user exists in database
 * @returns @user object, JWT, and additional info on token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    subject: user.Username, // This is the username you're encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256', // This is the algorithm used to 'sign' or encode the values of the JWT
  });
};

/* POST login */
/**
 * This function checks if user exists in DB, handles user login, generates JWT upon login
 * @name postLogin
 * @kind function
 * @returns user object with JWT
 * @requires passport
 * @param router to get API endpoint
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
