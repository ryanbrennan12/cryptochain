import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: { address: 'foobbabb', balance: 9990 }
    }
  }
  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div>

        <div>Address: {address}</div>
        <div>Balance: {balance}</div>
      </div>
    )
  }
}

export default App;