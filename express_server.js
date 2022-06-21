const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require('bcryptjs');
const app = express();
app.use(cookieSession({
  name: "session",
  keys: ["oreo's with milk"], // secret key
  maxAge: 24 * 60 * 60 * 1000
}));
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // Telling Express to use EJS as its templating engine

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
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
};

// Helper Functions: Generating random ID's
function generateRandomString() { //generating an alpha-numeric string
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ans = "";
  for (let i = 0; i < 6; i++) {
    let result = Math.floor(Math.random() * list.length);
    ans += list.charAt(result);
  }
  return ans;
}

// Helper Function: Checking if email exists
const helpers = require('./helpers');

// Routing to main page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// Login Routes
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("login_page", templateVars);
});

app.post("/login", (req, res) => {
  
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).send("Missing email and/or password");
  }

  const user = helpers(users, email);
  if (!user) {
    return res.status(400).send("Invalid credentials");
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid credentials");
  }
 
  req.session.user_id = user.id;
  res.redirect("/urls");
});

// Logging Out Route
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Creating a new Tiny URL
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", {user});
  }
});

// Renders index
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

// Posting URL's
app.post("/urls", (req, res) => {
  let userID = users[req.session.user_id].id;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL,
    userID
  };
  res.redirect(`/urls/${[shortURL]}`);
});

// Route to show Edit page
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    shortURL,
    longURL,
    user
  };
  res.render("urls_show", templateVars);
});

// Route to edit a longURL
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.updatedlongURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

// Route to delete a ShortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// Register routes
app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("registration_page", templateVars);
});

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  if (email === "" || password === "") {
    return res.status(400).send("Email or Password is empty");
  }
  
  const emailExists = helpers(users, email);
  if (emailExists) {
    return res.status(400).send("An account with this email already exists");
  }
  
  const hashPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: hashPassword
  };

  req.session.user_id = id;
  res.redirect("/urls");
});

// Message to let us know there the connection is working
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});