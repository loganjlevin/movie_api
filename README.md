# Movie API

- This RESTful API is deployed at https://myflix-d2kt.onrender.com

## Description

This is the backend for the full stack 'MyFlix' web application (written with [React](https://github.com/loganjlevin/myFlix-client) and [Angular](https://github.com/loganjlevin/myFlix-Angular)). This API interfaces between the client and the MongoDB database. The MyFlix web app provides users with access to information about different movies, directors, and genres. Users will be able to sign up, view a list of all the movies stored in the database, search for a specific movie, update their personal information, and create a list of their favorite movies.

---

## Features

- Get a list of all movies to the client
- Get data about a single movie to the client including description, director, genre, image url
- Get the description of a genre
- Get data about director including bio, birth year, death year
- Register a new user
- Update an existing user's information (username, password, email, birthday)
- Add and remove a movie from a user's list of favorites
- Delete an existing user's profile

---

## Technologies

- Node.js
- Express
- Mongoose
