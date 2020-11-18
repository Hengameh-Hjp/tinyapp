const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({name: 'session', secret: 'grey-rose-juggling-volcanoes'}));

const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');

// functions
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "mohsen" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "hana" }
};

// server listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


// redirects to /urls if logged in, otherwise to /login
app.get('/', (req, res) => {
  res.send("Hello!");
});

// shows urls that belong to the user, if they are logged in
app.get('/urls', (req, res) => {
  const userID = req.session.userID;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urls: userUrls, user: users[userID] };
  if (!userID) {
    res.statusCode = 401;
  }
  res.render('urls_index', templateVars);
});

// adds new url to database, redirects to short url page
app.post('/urls', (req, res) => {
  if (req.session.userID) {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.userID
    };
    res.redirect(`/urls/${shortURL}`);
  }
});

// validates if the user is logged in before displaying page
app.get('/urls/new', (req, res) => {
  if (req.session.userID) {
    const templateVars = {user: users[req.session.userID]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

// shows details about the url if it belongs to user
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urlDatabase, userUrls, shortURL, user: users[userID] };
  if (!userID || !userUrls[shortURL]) {
    const errorMessage = 'This URL is not in your database.';
    res.status(401).send(errorMessage);
  } else {
    res.render('urls_show', templateVars);
  }
});

// updates longURL if url belongs to user
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.userID  && req.session.userID === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
    res.redirect(`/urls`);
  } else {
    const errorMessage = 'Not authorized.';
    res.status(401).send(errorMessage);
  }
});

// deletes url from database if it belongs to user
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.userID  && req.session.userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    const errorMessage = 'Not authorized.';
    res.status(401).send(errorMessage);
  }
});


app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    const errorMessage = 'This short URL does not exist.';
    res.status(404).send(errorMessage);
  }
});

// redirects to urls index page if already logged in
app.get('/login', (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  res.render('urls_login', templateVars);
});

// redirects to urls index page if credentials are valid
app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (user && (req.body.password === user.password)) {
    req.session.userID = user.userID;
    res.redirect('/urls');
  } else {
    const errorMessage = 'Not valid.';
    res.status(401).send(errorMessage);
  }
});

// clears cookies and redirects to urls index page
app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/urls');
});

// redirects to urls index page if already logged in
app.get('/register', (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  res.render('urls_registration', templateVars);
});

// redirects to urls index page if credentials are valid
app.post('/register', (req, res) => {
  if (req.body.email && req.body.password) {
    if (!getUserByEmail(req.body.email, users)) {
      const userID = generateRandomString();
      users[userID] = {
        userID,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      };
      req.session.userID = userID;
      res.redirect('/urls');
    } else {
      const errorMessage = 'This email address is already registered.';
      res.status(400).send(errorMessage);
    }
  } else {
      const errorMessage = 'Empty username or password. Please make sure you fill out both fields.';
      res.status(400).send(errorMessage);
  }
});



const users = {
  "hana": {
    userID: "hana",
    email: "hana@example.com",
    password: "hajhana"
  },
 "mohsen": {
    userID: "mohsen",
    email: "mohsen@example.com",
    password: "loplop"
  }
}