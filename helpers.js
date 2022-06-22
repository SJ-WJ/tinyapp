// Helper Functions: Generating random ID's
const generateRandomString = function() {
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ans = "";
  for (let i = 0; i < 6; i++) {
    let result = Math.floor(Math.random() * list.length);
    ans += list.charAt(result);
  }
  return ans;
};

// Helper Function: Checking if email exists
const getUserByEmail = function(users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
};

//Helper Function: Filtering urlDatabase
const urlsForUser = function(urlDatabase, userID) {
  let userUrls = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      userUrls[url] = urlDatabase[url];
    }
  } return userUrls;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser
};