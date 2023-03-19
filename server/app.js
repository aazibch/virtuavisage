const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const express = require('express');
const app = express();

require('./middleware/auth');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 100 * process.env.SESSION_AGE, // 1 day
      sameSite: 'lax'
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_SESSION_URL })
  })
);
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes.js');
const stableDiffusionRoutes = require('./routes/stableDiffusionRoutes.js');
const globalErrorHandler = require('./middleware/error');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/stable', stableDiffusionRoutes);
app.use(globalErrorHandler);

module.exports = app;
