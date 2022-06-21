// Helper Function: Checking if email exists
function getUserByEmail(users, email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
}

module.exports = getUserByEmail;