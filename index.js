// import express and morgan packages
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

// assign express to app object
const app = express();

// use morgan logging package
app.use(morgan('common'));

// use body parser package
app.use(bodyParser.json());

// send static files from public folder when requested
app.use(express.static('public'));

// list of movie objects
let movies = [
  {
    title: 'Citizen Kane',
    director: 'Orson Welles',
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
  },
  {
    title: '2001: A Space Odyssey',
    director: 'Stanley Kubrick',
  },
  {
    title: "Singin' in the Rain",
    director: 'Stanley Donen',
  },
  {
    title: 'Casablanca',
    director: 'Michael Curtiz',
  },
  {
    title: "Schindler's List",
    director: 'Steven Spielberg',
  },
  {
    title: 'Annie Hall',
    director: 'Woody Allen',
  },
  {
    title: 'Taxi Driver',
    director: 'Martin Scorsese',
  },
  {
    title: 'Vertigo',
    director: 'Alfred Hitchcock',
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
  },
];

// get a list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// get data about a movie by title
app.get('/movies/:title', (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.title === req.params.title;
    })
  );
});

// get data about a genre by name
app.get('/genres/:title', (req, res) => {
  res.send('Successful GET request returning data on a genre.');
});

// get data about a director by name
app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returning data on a director.');
});

// post a new user's data
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    const message = "Missing 'username' in request body";
    res.status(400).send(message);
  } else {
    res.send('Successful POST request returning json object of user with id');
  }
});

// Update a user's username by id
app.put('/users/:id/:username', (req, res) => {
  res.send('Successful PUT request indicating the username was updated');
});

// Add a movie to a user's list of favorites
app.put('/users/:id/favorites/:title', (req, res) => {
  res.send(
    'Successful PUT request indicating the movie was added to favorites'
  );
});

// Remove a movie from a user's list of favorites
app.delete('/users/:id/favorites/:title', (req, res) => {
  res.send(
    'Successful DELETE request indicating the movie was removed from favorites'
  );
});

// Deregister an existing user
app.delete('/users/:id', (req, res) => {
  res.send('Successful DELETE request indicating the user was deregistered');
});

// error handling in case something goes wrong
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// listen on port 8080 and log the port
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
