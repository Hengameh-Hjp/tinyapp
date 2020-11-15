const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');
app.use(cookieSession({name: 'session', secret: 'grey-rose-juggling-volcanoes'}));

const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');

const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "mohsen" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "hana" }
};




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});



app.get('/', (req, res) => {
  res.send("Hello!");
});


app.get('/urls', (req, res) => {
  const userID = req.session.userID;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urls: userUrls, user: users[userID] };
  if (!userID) {
    res.statusCode = 401;
  }
  res.render('urls_index', templateVars);
});


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


app.get('/urls/new', (req, res) => {
  if (req.session.userID) {
    const templateVars = {user: users[req.session.userID]};
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});


app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  const userUrls = urlsForUser(userID, urlDatabase);
  const templateVars = { urlDatabase, userUrls, shortURL, user: users[userID] };

if (!userID || !userUrls[shortURL]) {
    const errorMessage = 'This URL is not in your database.';
    res.status(401).send(errorMessage)
  } else {
    res.render('urls_show', templateVars);
  }
});


app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;

  if (req.session.userID  && req.session.userID === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.updatedURL;
    res.redirect(`/urls`);
  } else {
    const errorMessage = 'Not authorized.';
    res.status(401).send(errorMessage)
  }
});


app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  if (req.session.userID  && req.session.userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    const errorMessage = 'Not authorized.';
    res.status(401).send(errorMessage)
  }
});


app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    const errorMessage = 'This short URL does not exist.';
    res.status(404).send(errorMessage)
  }
});


app.get('/login', (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  res.render('urls_login', templateVars);
});


app.post('/login', (req, res) => {
  const user = getUserByEmail(req.body.email, users);
  if (user && (req.body.password === user.password)) {
    req.session.userID = user.userID;
    res.redirect('/urls');
  } else {
    const errorMessage = 'Not valid.';
    res.status(401).send(errorMessage)
  }
});


app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.clearCookie('session.sig');
  res.redirect('/urls');
});


app.get('/register', (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  res.render('urls_registration', templateVars);
});


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
      res.status(400).send(errorMessage)
    }
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