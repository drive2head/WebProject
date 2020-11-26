const {describe, it, after} = require('mocha');
const chai = require('chai');
const {should, expect} = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const {Record, Person, Phoneme} = require('.././server/src/model.js');

const mongoose = require("mongoose");
const {userSchema} = require("../authService/build/model.js");
const app = require("../authService/build/index.js");

var connection = mongoose.createConnection('mongodb://localhost/users', 
                    {useNewUrlParser: true, useUnifiedTopology: true});
const User = connection.model("users", userSchema);

const timeoutDuration = 3000;

describe("users", () => {
  // Empty database before all test cases are executed.
  before(async () => {
    await User.deleteMany();
  });

  // Empty database after all test cases are executed.
  after(async () => {
    await User.deleteMany({}, (err) => {
    });
    await connection.close();
    await app.close();
  });

  // Unit tests //

  /**
   * Unit test suite for the POST /signup route.
   */
  describe("POST /signup", () => {
    /**
     * Tests the POST /signup route.
     * Expected to return ....
     * Expected to return a 200 OK status code.
     */
    it("Successfully POST 1 User with all parameters specified.", (done) => {
      const username = "usertest";
      const password = "1234";
      const name = "User";
      const surname = "Test";

      User.deleteMany({}, (err) => {
        chai
          .request(app)
          .post('/signup')
          .send({
            username: username,
            password: password,
            name: name,
            surname: surname,
          })
          .end((err, res) => {
            const { username, password, name, surname } = res.body;
            chai.assert.equal(res.body.username, username);
            chai.assert.equal(res.body.password, password);
            chai.assert.equal(res.body.name, name);
            chai.assert.equal(res.body.surname, surname);
            done();
          })
          .timeout(timeoutDuration);
      });
    });
  });
});
