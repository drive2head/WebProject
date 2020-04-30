const {describe, it} = require('mocha')
const {expect} = require('chai')
const {addUser, getUser} = require('.././server/src/userAuth.js')
const {Record, Person, Phoneme} = require('.././server/src/model.js')
const {addRecord, addPhonemes, notabs} = require('.././server/src/query.js')
const {findRecordByName} = require('.././server/src/recordsDB.js')

describe('user auth functions', function () {
  it('shouldnt add user', function() {
    return addUser('testName1')
      .then(function(res) {
        expect(res.completed)
          .to.equal(false);
      })
  })
  it('should find user', function() {
    return getUser('testName1')
      .then(function(res) {
        expect(res)
          .to.be.a('object');
      })
  })

  it('shouldnt find user', function() {
    return getUser('testName3')
      .then(function(res) {
        expect(res)
          .to.be.a('null');
      })
  })
  //removeUser('testName1');
});

describe('model', function () {
  it('should be an array', () => {
    expect(Record('name', ['1', '2']).tags).to.be.a('array')
  })

  it('should be an object', () => {
    expect(Record('name', ['1', '2'])).to.be.a('object')
  })

  it('should fill null by default', () => {
    expect(Phoneme('1', '2', '3', '4').dialect).to.equal(null)
  })
});

describe('query', function () {
  it('should return string', () => {
    expect(addRecord({}, 1)).to.be.a('string')
  })

});

describe('records in db', function () {
  it('should return null (record with this name doesnt exist)', function() {
    return findRecordByName('name')
      .then(function(res) {
        expect(res)
          .to.equal(null);
      })
  })
});