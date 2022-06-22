const { assert } = require('chai');
const {generateRandomString, getUserByEmail} = require('../helpers.js');

const testUsers = {
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

describe('getUserByEmail', function() {

  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

});

describe('getUserByEmail', function() {

  it(' If we pass in an email that is not in our users database, then our function should return undefined', function() {
    const user = getUserByEmail(testUsers, "apple@example.com");
    const expectedUserID = undefined;
    assert.equal(user.id, expectedUserID);
  });

});