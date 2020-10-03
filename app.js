require('dotenv').config();
const path = require('path');
const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const app = express();
const errorsController = require('./controllers/error');
const authRoutes = require('./routes/auth');
const flash = require('./middlewares/flash');
const clientRoutes = require('./routes/client');
const apiRoutes = require('./routes/api');
const csrf = require('csurf');
const UserSession = require('./models/userSession');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/gigcloud';

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1 * (24 * 60 * 60 * 1000),
    },
  })
);
app.use(flash);
app.use(csrfProtection);
app.use((req, res, next) => {
  const { isAuthenticated } = req.session;
  res.locals.isAuthenticated = isAuthenticated;
  res.locals.currentUser = isAuthenticated
    ? new UserSession(req.session.user)
    : undefined;
  res.locals.csrfToken = req.csrfToken();
  res.locals.moment = moment;
  next();
});
app.use(authRoutes);
app.use(clientRoutes);
app.use(apiRoutes);
app.use(errorsController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.use((req, res, next) => {
      next();
    });
    console.log('Connected');
    const Genre = require('./models/genre');
    const genreList = require('./data/genres');
    Genre.where({})
      .exec()
      .then((genres) => {
        if (genres.length <= 0) {
          const data = genreList.map((g) => ({
            title: g,
          }));
          Genre.insertMany(data)
            .then((g) => console.log(g))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
    app.listen(3000);
  })
  .catch((err) => console.log(err));
