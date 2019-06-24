const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
  constructor({ blockchain }) {
    //every PuSub instance will have a local blockchain to it
    this.blockchain = blockchain;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNELS.TEST);
    this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

    this.subscribeToChannels

    this.subscriber.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    })
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message} ) {
    this.publisher.publish(channel, message);
  }

  broadcastChain() {
    this.publish({
      channel: Channels.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    })
  }
}

module.exports = PubSub;