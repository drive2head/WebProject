const {describe, it} = require('mocha')
const {expect} = require('chai')
const {Record, Person, Phoneme} = require('.././server/src/model.js')
const speechDB = require('.././server/src/speechDB.js')

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

describe('Graph database (speechDB)', function () {
  var personId = -1;

  it('should add person', async () => {
    const result = await speechDB.addPerson(Person('TestPerson', '18', 'Test', 'testian', 'Testow', 'Testian Federation'));
    expect(result.completed).to.equal(true);

    personId = parseInt(result.output[0].id);
  })

  it('should add record', async () => {
    const result = await speechDB.addRecord(Record('test.wav', 'speech'), personId);
    expect(result.completed).to.equal(true);
  })

  it ('should add markup', async() => {
    const result = await speechDB.addMarkup('TestUsername', 'test.wav', [Phoneme('A', '0', '1', 'testian'), Phoneme('B', '1', '2', 'testian')]);
    expect(result.completed).to.equal(true);
  })

  it ('should return markup', async() => {
    const result = await speechDB.getMarkup('TestUsername', 'test.wav');
    expect(result.completed).to.equal(true);
    expect(result.output).to.be.a('array');
    expect(result.output[0].label).to.be.equal('Phoneme');
    expect(result.output[1].label).to.be.equal('Phoneme');
  })

  it ('should return list of markups', async() => {
    const result = await speechDB.getMarkups('TestUsername');
    expect(result.completed).to.equal(true);
    expect(result.output).to.be.a('array');
    expect(result.output[0].label).to.be.equal('Record');
    expect(result.output[0].properties.name).to.be.equal('test.wav');
  })

  it ('should delete markup', async() => {
    const result = await speechDB.deleteMarkup('TestUsername', 'test.wav');
    expect(result.completed).to.equal(true);
  })

  it('should delete record', async () => {
    const result = await speechDB.deleteRecord('test.wav');
    expect(result.completed).to.equal(true);
  })


  it('should delete person', async () => {
    const result = await speechDB.deletePerson(personId);
    expect(personId).to.not.equal(-1);
    expect(result.completed).to.equal(true);
  })

  // it('..', () => {
  //   process.exit();
  // })
});

// describe('MongoDB (records-/speakers-DB, userAuth)', function () {
  // it('should register user', async () => {
// 
  // })
  // 
// });
