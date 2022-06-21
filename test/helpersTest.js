const { assert } = require('chai');

const helpers = require('../helpers.js');

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
    const user = helpers(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user.id, expectedUserID);
  });

});

describe('getUserByEmail', function() {

  it(' If we pass in an email that is not in our users database, then our function should return undefined', function() {
    const user = helpers(testUsers, "apple@example.com");
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.equal(user.id, expectedUserID);
  });

});