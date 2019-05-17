const express = require('express');
const app = express();
const port = 3000;

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');

const db = require('./models');
const Todo = db.Todo;
const User = db.User;

const HomeRouter = require('./routers/home');
const UserRouter = require('./routers/user');
const TodoRouter = require('./routers/todo');

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'soajdpjp',
  resave: 'false',
  saveUninitialized: 'false'
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
app.use((req, res, next) => {
  res.locals.user = req.user,
    next()
})


app.get('/', (req, res) => {
  res.send('HomePage');
})

app.use('/', HomeRouter);
app.use('/users', UserRouter);
app.use('/todos', TodoRouter);

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`App is running on http://localhost:${port}`);
})