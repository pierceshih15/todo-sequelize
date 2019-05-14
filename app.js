const express = require('express');
const app = express();
const port = 3000;

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const UserRouter = require('./routers/user');

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.send('HomePage');
})

app.use('/users', UserRouter);

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
})