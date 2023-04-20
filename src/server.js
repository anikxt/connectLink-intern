// import { config } from 'dotenv';
import 'dotenv/config';
import express from 'express';
import connectToMongo from './utils/db.js';
import expressLayout from 'express-ejs-layouts';
import initializePassport from './config/passport.js';
import passport from 'passport';
import apiRouter from './routers/api.js';
import * as url from 'url';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';

const app = express();
const PORT = process.env.PORT || 3000;

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Assets
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// Middleware for ejs variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// set Template engine
app.use(expressLayout);
const viewsPath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '/resources/views'
);
app.set('views', viewsPath);
app.set('view engine', 'ejs');

// Test route (root)
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello World!' });
// });

// Main Route
app.use('/', apiRouter);

// Start the server
const main = async () => {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

main().catch(console.error);
