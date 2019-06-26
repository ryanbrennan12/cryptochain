const cryptoHash = require('./crypto-hash.js');

describe('cryptoHash()', () => {

  it('generates a SHA-256 hashed output', () => {
    expect(cryptoHash('hashiehash'))
    .toEqual('0829e6fa4fb34d94d86163ec852f2f7bea498a7a18327bac34fa48bda6881119');
  });

  it('produces the same hash with the same input arguments in any order', () => {
    expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('three', 'two', 'one'));
  });

  it('produces a unique hash when the properties have changed on an input', () => {
    const foo = {};
    const originalHash = cryptoHash(foo);
    foo['a'] = 'a';

    expect(cryptoHash(foo)).not.toEqual(originalHash);
  });
});