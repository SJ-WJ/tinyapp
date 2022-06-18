const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // Telling Express to use EJS as its templating engine

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

// Helper Functions
function generateRandomString() { //generating an alpha-numeric string
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ans = "";
  for (let i = 0; i < 6; i++) {
    let result = Math.floor(Math.random() * list.length);
    ans += list.charAt(result);
  }
  return ans
}

// Helper Function: Checking if email exists
function ifEmailExists(users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  } 
  return false;
};

// Routes are down below

app.post("/login", (req, res) => {
  const userName = req.body.username
  res.cookie('username', userName);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  const longURL = req.body.longURL
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${[id]}`);
});

app.get("/urls", (req, res) => {
  // let userId = 
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});

// Edit long URL route
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = req.body.updatedlongURL
  urlDatabase[shortURL] = longURL
  res.redirect("/urls")
})


app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL
  delete urlDatabase[shortURL]
  res.redirect("/urls")
})

// Routing registration page to /register
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("registration_page", templateVars)
})

app.post("/register", (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const id = generateRandomString()
  
  if (email === "" || password === "") {
    return res.status(400).send("Email or Password is empty")
  } 
  
  const emailExists = ifEmailExists(users, email)
  if (emailExists === true) {
    return res.status(400).send("An account with this email already exists")
  }
  users[id] = { id: id, email: email, password: password }
  
  res.cookie('user_id', id);
  res.redirect("/urls");
})

// Message to let us know there the connection is working
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});