const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;
const app = express();
const { getNotFoundPage } = require('./controllers/error');

const authRoutes = require('./routes/auth');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(authRoutes);
app.use(getNotFoundPage);

mongoConnect(() => {
  app.use((req, res, next) => {
    next();
  });
  app.listen(3000);
});
