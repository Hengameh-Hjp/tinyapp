const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { json } = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "002" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
app.get("/", (req, res) => {
  res.send("Hello!");
});
const urlsForUser = function(id) {
  let newUrlDatabase = {};
  for (let item in urlDatabase) {
    if (urlDatabase[item].userId === id) {
      newUrlDatabase[item] =  urlDatabase[item];
    }
}
return newUrlDatabase;
}
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlsForUser(req.cookies["userId"]), user: users[req.cookies["userId"]]};
  res.render("urls_index", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
/*app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });*/
 app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});
app.get("/urls/new", (req, res) => {
  if(req.cookies["userId"]){
    res.render("urls_new");
  }else {
    res.redirect("/login");
  }
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["userId"]]}
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
/*function generateRandomString () {
  let rand = Math.random().toString(36).substring(6);
  return rand;
};*/
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const obj = urlDatabase[shortURL];
  res.redirect(obj.longURL);
});
app.post("/urls/:url/delete", (req, res)=>{
  if(req.cookies["userId"] !== undefined && req.cookies["userId"] !== null ){
  const url = req.params.url;
  delete urlDatabase[url];
  res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});
/*app.post("/urls/:url/edit", (req, res) =>{
  if(req.cookies["userId"] !== undefined && req.cookies["userId"] !== null ){
    const url = req.params.url;
    edit urlDatabase[url];
    res.redirect("/urls");
    } else {
      res.redirect("/login");
    }
})*/
app.post("/urls/:url", (req, res)=>{
  const url = req.params.url;
  urlDatabasete[url]= res.body.updatedLongUrl;
  res.redirect("/urls");
});
app.get('/login', (req, res)=>{
  const templateVars = {user:users[req.cookies["userId"]]}
  res.render('login', templateVars);
});
app.get('/register', (req, res)=>{
  const templateVars = {user:users[req.cookies["userId"]]}
  res.render('register', templateVars);
});
app.post("/register",(req, res) =>{
  const {email, password} =req.body;
  if(!email || !password){
    return res.status(400).send("Please provide right email or password")
  }
  for (const id in users){
    if(email === users[id].email){
      return res.status(400).send("Email is existed.");
    }
  };
  const id = generateRandomString();
  const user = {id, email, password};
  users[id]= user;
  res.cookie("userId", id);
  res.redirect("/urls")
});
app.post("/login", (req, res)=>{
  const {email, password} =req.body;
  if(!email || !password){
    return res.status(403).send("Please provide right email or password")
  }
  for (const id in users) {
    if(email === users[id].email) {
      if(password === users[id].password) {
         req.cookies["userId"];
         res.redirect("/urls");
    } else {
      return res.status(403).send("Error");
    }
    };
  };
  const id = generateRandomString();
  const user = {id, email, password};
  users[id]= user;
  res.cookie("userId", id);
  res.redirect("/urls")
});
app.post('/logout', (req, res)=>{
  res.clearCookie("userId")
  res.redirect("/urls")
});
const generateRandomString = ()=> Math.random().toString(36).substring(2, 8);
const users = {
  "001": {
    id: "001",
    email: "mina@example.com",
    password: "lovelove"
  },
 "002": {
    id: "002",
    email: "dana@example.com",
    password: "loplop"
  }
}