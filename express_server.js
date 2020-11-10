var path = require('path');

const express = require("express");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.set('views', path.join('/Users/mohsen/lighthouse/w3/tinyapp', 'views'));

function generateRandomString() {
  const SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let strings = SALTCHARS.split("")
  let len_char = 6
  let my_str = ""
  for (let i=0; i<len_char; i++){
    my_str += strings[Math.floor(Math.random()*strings.length)]
  }
  return my_str
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

/*
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
*/

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.post("/urls/delete", (req, res) => {
  //const shortUrl = req.params.url;
  delete urlDatabase['b2xVn2'];
  res.redirect ('/urls');
});


/*
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
  urlDatabase[generateRandomString()] = req.body['longURL']
  console.log(urlDatabase)
});

*/

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});
