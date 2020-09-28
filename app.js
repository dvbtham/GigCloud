const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const app = express();
const { getNotFoundPage } = require('./controllers/error');
const authRoutes = require('./routes/auth');
const csrf = require('csurf');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/gigcloud';
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'gigcloud secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.currentUser = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(authRoutes);
app.use(getNotFoundPage);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.use((req, res, next) => {
      next();
    });
    console.log('Connected');
    app.listen(3000);
  })
  .catch((err) => console.log(err));
