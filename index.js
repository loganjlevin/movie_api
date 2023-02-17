// import express and morgan packages
const express = require('express'),
  morgan = require('morgan');

// assign express to app object
const app = express();

// list of top movie objects
let topMovies = [
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

// use morgan logging package
app.use(morgan('common'));

// display movies as json when requested at /movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// send a default text response when requested at /
app.get('/', (req, res) => {
  res.send('Default textual response of my choosing.');
});

// send static files from public folder when requested
app.use(express.static('public'));

// error handling in case something goes wrong
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// listen on port 8080 and log the port
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
