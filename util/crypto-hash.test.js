const cryptoHash = require('./crypto-hash.js');

describe('cryptoHash()', () => {

  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('hashiehash'))
    .toEqual('94229cd1c39e3e2e279e6a7b83e59cd8fd364ebf47f3f2ce821e0f3a9c1f11f8');
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
  });
});