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
      maxAge: 24 * 60 * 60 * 100 * process.env.SESSION_AGE,
      sameSite: 'lax'
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_SESSION_URL })
  })
);
app.use(passport.initialize());
app.use(passport.session());

const usersRoutes = require('./routes/usersRoutes');
const artifactsRoutes = require('./routes/artifactsRoutes');
// const postsRoutes = require('./routes/postsRoutes.js');
// const stableDiffusionRoutes = require('./routes/stableDiffusionRoutes.js');
const globalErrorHandler = require('./middleware/error');

app.use('/v1/users', usersRoutes);
app.use('/v1/artifacts', artifactsRoutes);
// app.use('/api/v1/post', postsRoutes);
// app.use('/api/v1/stable', stableDiffusionRoutes);
app.use(globalErrorHandler);

module.exports = app;
