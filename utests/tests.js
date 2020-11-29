const {describe, it, after} = require('mocha');
const chai = require('chai');
const {should, expect} = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const mongoose = require("mongoose");
const {userSchema} = require("../authService/build/model.js");
const {recordSchema} = require("../audioService/build/model.js");

const timeoutDuration = 3000;

describe("Service test", () => {

  describe("authService test", () => {
    let connection = null;
    let app = null;
    let User = null;

    before(() => {
      connection = mongoose.createConnection('mongodb://localhost/users', 
                    {useNewUrlParser: true, useUnifiedTopology: true});
      User = connection.model("users", userSchema);
      app = require("../authService/build/index.js");
    });

    after(async () => {
      await connection.close();
      app.close();
    });

    beforeEach(async () => {
      await User.deleteMany();
    });

    afterEach(async () => {
      await User.deleteMany();
    });
    /**
     * Unit test suite for the POST /signup route.
     */
    describe("POST /signup", () => {
      /**
       * Tests the POST /signup route.
       * Expected to return ....
       * Expected to return a 200 OK status code.
       */
      it("Successfully SIGN UP 1 User with all parameters specified.", (done) => {
        const u_username = "newuser";
        const u_password = "12345";
        const u_name = "User";
        const u_surname = "New";

        chai
          .request(app)
          .post('/signup')
          .send({
            username: u_username,
            password: u_password,
            name: u_name,
            surname: u_surname,
          })
          .end((err, res) => {
            const expected_status = true;
            const expected_msg = "User was succesfully created";
            const { status, msg } = res.body;
            chai.assert.equal(status, expected_status);
            chai.assert.equal(msg, expected_msg);
            done();
          })
          .timeout(timeoutDuration);
      });
    });

    describe("POST /signin", () => {
      /**
       * Tests the POST /signin route.
       * Expected to return ....
       * Expected to return a 200 OK status code.
       */
      it("Successfully SIGN IN 1 User with all parameters specified.", (done) => {
        const u_username = "usertest";
        const u_password = "1234";
        const u_name = "User";
        const u_surname = "Test";

        const user = new User({
          username: u_username,
          password: u_password,
          name: u_name,
          surname: u_surname
        });

        user.save({}, () => {
          chai
            .request(app)
            .post('/signin')
            .send({
              username: u_username,
              password: u_password,
            })
            .end((err, res) => {
              const expected_status = true;
              const expected_msg = "User was succesfully verified";
              const { status, msg } = res.body;
              chai.assert.equal(status, expected_status);
              chai.assert.equal(msg, expected_msg);
              done();
            })
            .timeout(timeoutDuration);
        });
      });
    });

    describe("POST /profile", () => {
      /**
       * Tests the POST /profile route.
       * Expected to return ....
       * Expected to return a 200 OK status code.
       */
      it("Successfully RETURNED PROFILE 1 User with all parameters specified.", (done) => {
        const u_username = "existinguser";
        const u_password = "123";
        const u_name = "User";
        const u_surname = "Old";

        const user = new User({
          username: u_username,
          password: u_password,
          name: u_name,
          surname: u_surname
        });

        user.save({}, () => {
          chai
            .request(app)
            .post('/profile')
            .send({
              username: u_username
            })
            .end((err, res) => {
              const { username, password, name, surname } = res.body;
              chai.assert.equal(username, u_username);
              chai.assert.equal(password, u_password);
              chai.assert.equal(name, u_name);
              chai.assert.equal(surname, u_surname);
              done();
            })
            .timeout(timeoutDuration);
        });
      });
    });
  });


  describe("authService test", () => {
    let connection = null;
    let app = null;
    let Record = null;

    before(() => {
      connection = mongoose.createConnection('mongodb://localhost/records', 
                    {useNewUrlParser: true, useUnifiedTopology: true});
      Record = connection.model("records", recordSchema);
      app = require("../audioService/build/index.js");
    });

    after(async () => {
      await connection.close();
      app.close();
    });

    beforeEach(async () => {
      await Record.deleteMany();
    });

    afterEach(async () => {
      await Record.deleteMany();
    });
    /**
     * Unit test suite for the GET /records route.
     */
    describe("GET /records", () => {
      /**
       * Tests the GET /records route.
       * Expected to return ....
       * Expected to return a 200 OK status code.
       */
      it("Successfully RETURN records array.", (done) => {
        var r_records_promises = [];
        for (i = 0; i < 5; i++) {
          const record = new Record();
          record.name = 'record_' + i;
          record.path = '/';
          record.speakerId = new mongoose.Types.ObjectId();
          r_records_promises.push(record.save());
        };

        Promise.all(r_records_promises)
        .then((r_records) => {
          chai
            .request(app)
            .get('/records')
            .end((err, res) => {
              const records = res.body;
              expect(records).to.be.a('array');
              for (i = 0; i < records.length; i++) {
                const record = records[i];
                const r_record = r_records[i];
                const r_name = r_record.name;
                const r_path = r_record.path;
                const r_speakerId = r_record.speakerId.toString();
                chai.assert.equal(record.speakerId, r_speakerId);
                chai.assert.equal(record.name, r_name);
                chai.assert.equal(record.path, r_path);
              }
              done();
            })
            .timeout(timeoutDuration);
        });
      });
    });

    describe("POST /records", () => {
      /**
       * Tests the POST /records route.
       * Expected to return ....
       * Expected to return a 200 OK status code.
       */
      it("Successfully POST 1 Record with all parameters specified.", (done) => {
        r_name = 'new_record';
        r_path = '/';
        r_speakerId = new mongoose.Types.ObjectId();

        chai
          .request(app)
          .post('/records')
          .send({
            speakerId: r_speakerId,
            name: r_name,
            path: r_path
          })
          .end((err, res) => {
            const record = res.body;
            chai.assert.equal(record.speakerId, r_speakerId.toString());
            chai.assert.equal(record.name, r_name);
            chai.assert.equal(record.path, r_path);
            done();
          })
          .timeout(timeoutDuration);
      });
    });
  });
});
