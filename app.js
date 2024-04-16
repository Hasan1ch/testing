const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { User } = require('./models/user');

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User(email);

  try {
    const userId = await user.getIdFromEmail();
    if (userId) {
      await user.setUserPassword(password);
    } else {
      await user.addUser(password);
    }
    res.redirect('/login');
  } catch (err) {
    console.error('Error while registering user:', err);
    res.status(500).send('Error registering user');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = new User(email);

  try {
    const userId = await user.getIdFromEmail();
    if (userId) {
      const isAuthenticated = await user.authenticate(password);
      if (isAuthenticated) {
        req.session.userId = userId;
        req.session.loggedIn = true;
        res.redirect('/');
      } else {
        res.send('Invalid password');
      }
    } else {
      res.send('Invalid email');
    }
  } catch (err) {
    console.error('Error while logging in:', err);
    res.status(500).send('Error logging in');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.render('home', { userId: req.session.userId });
  } else {
    res.redirect('/login');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});