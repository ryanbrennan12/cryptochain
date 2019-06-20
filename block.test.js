const Block = require('./block');
//first arg to describe is name of tests followed by JS function to be run
describe('Block', () => {
  //variable for every relevant field of a block
  const timestamp = 'a-date';
  const lastHash = 'foo-hash';
  const hash = 'bar-hash';
  const data = ['blockchain', 'data'];
  const block = new Block({ timestamp, lastHash, hash, data });

  it('has a timestamp, lastHash, hash, and data property', () => {
    //actual value, expected equal
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe('genesis()', () => {
    //not on instance of Block, but on Block classname itself
    const genesisBlock = Block.genesis();
  });
});
