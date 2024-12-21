import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// Serve static files from the client/dist folder
app.use(express.static('../client/dist'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json()); // Parses JSON in request bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

// Connect the routes
app.use(routes);

// Start the server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
