// import packages and modules
const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  { check, validationResult } = require('express-validator'),
  port = process.env.PORT || 8080;

// create models for movies and users
const Movies = Models.Movie;
const Users = Models.User;

// connect mongoose to mongoDB Atlas or local host
const { CONNECTION_URI } = require('./config');
mongoose.connect(CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// assign express to app object
const app = express();
const cors = require('cors');

// use body parser package
app.use(express.json());

// use cors Cross-Origin Resource Sharing
app.use(cors());
//let allowedOrigins = ['*', 'http://localhost:1234'];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins[0] === '*') {
//         return callback(null, true);
//       }
//       if (allowedOrigins.indexOf(origin) === -1) {
//         // If a specific origin isn't found on the list of allowed origins
//         let message =
//           "The CORS policy for this application doesn't allow access from origin " +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

let auth = require('./auth.js')(app);

const passport = require('passport');
require('./passport.js');

// use morgan logging package
app.use(morgan('common'));

// send static files from public folder when requested
app.use(express.static('public'));

// get a list of all movies
/**
 * @method GET to endpoint '/movies'
 * @name getMovies
 * @kind function
 * @requires passport module for authentication
 * @requires movies mongoose.Model
 * @returns a JSON object holding data about all the movies
 */
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// get data about a movie by title
/**
 * @method GET to endpoint '/movies/:Title'
 * @name getMovie
 * @kind function
 * @requires passport module for authentication
 * @requires movies mongoose.Model
 * @returns Returns a JSON object holding data about a single movie by title
 */
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// get data about a genre by name
/**
 * @method GET to endpoint '/genres/:Name'
 * @name getGenre
 * @kind function
 * @requires passport module for authentication
 * @requires movies mongoose.Model
 * @returns a JSON object holding data about genre by name
 */
app.get(
  '/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// get data about a director by name
/**
 * @method GET to endpoint '/directors/:Name'
 * @name getDirector
 * @kind function
 * @requires passport module for authentication
 * @requires movies mongoose.Model
 * @returns a JSON object holding data about director by name
 */
app.get(
  '/directors/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// post a new user's data
/**
 * This function allows new users to Register:
 * validates request JSON object (includes all required fields)
 * checks DB, if the user that is going to be created already exists
 * if no errors appeared, creates new user object in DB
 * @method POST to endpoint '/users'
 * @name addUser
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns a JSON object holding data of newly created user
 */
app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error' + error);
      });
  }
);

// Get all users
/**
 * This function allows request to get full list of users
 * @method GET to endpoint '/users'
 * @name getUsers
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns a JSON object holding data about all the USERS
 */
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// Get a user by id
/**
 * This function allows request to get info about one specific user by id
 * @method GET to endpoint '/users/:id'
 * @name getUser
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns a JSON object of a single user by id
 */
app.get(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ _id: req.params.id })
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error' + error);
      });
  }
);

// Update a user's info
/**
 * This function allows request to update info for specific user by id
 * validates request JSON object (includes all required fields)
 * checks DB, if the user that is going to be updated exists
 * if no errors appeared, updates user object in DB
 * @method PUT to endpoint '/users/:id''
 * @name updateUser
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns a JSON object with updated information
 */
app.put(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, //This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error: ' + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Add a movie to a user's list of favorites
/**
 * This function adds a specific movie to the list of favorites for specific user
 * @method POST to endpoint '/users/:id/movies/:MovieID'
 * @name addFavorite
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns a JSON object with updated user information
 */
app.post(
  '/users/:id/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error ' + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Remove a movie from a user's list of favorites
/**
 * This function deletes a specific movie from the list of favorites for specific user
 * @method DELETE to endpoint '/users/id/movies/:MovieID'
 * @name deleteFavorite
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns a JSON object with updated user information
 */
app.delete(
  '/users/:id/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error ' + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Deregister an existing user
/**
 * This function allows the user to delete account from DB
 * @method DELETE to endpoint '/users/:id'
 * @name deleteUser
 * @kind function
 * @requires passport module for authentication
 * @requires Users mongoose.Model
 * @returns message that :Username was deleted
 */
app.delete(
  '/users/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted');
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// error handling in case something goes wrong
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen on port 8080 and log the port
app.listen(port, '0.0.0.0', () => {
  console.log(`Your app is listening on port ${port}.`);
});
