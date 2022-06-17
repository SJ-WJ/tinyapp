const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs"); // Telling Express to use EJS as its templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() { //generating an alpha-numeric string
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ans = "";
  for (let i = 0; i < 6; i++) {
    let result = Math.floor(Math.random() * list.length);
    ans += list.charAt(result);
  } 
  return ans
}

app.post("/login", (req,res) =>{
  const userName = req.body.username
  console.log(req.body);
  res.cookie('username', userName);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls")
})

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  const longURL = req.body.longURL
  console.log(longURL);
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${[id]}`);
});

app.get("/urls", (req, res) => {
  // let userId = 
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  console.log(req.cookies["username"]);
  res.render("urls_index", templateVars);
});

// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render("hello_world", templateVars);
// });

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],   username: req.cookies["username"],};
  res.render("urls_show", templateVars);
});

// Edit long URL route
app.post("/urls/:shortURL", (req,res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.updatedlongURL
  console.log("Looking for req.body",req.body)
  console.log(longURL); //check for longURL
  urlDatabase[shortURL] = longURL
  res.redirect("/urls")
})


app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});