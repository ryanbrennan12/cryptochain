import React, { Component } from 'react';
import { log } from 'util';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: { address: 'foobbabb', balance: 9990 }
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/wallet-info')
    .then(res => res.json())
    .then(json => console.log('i am json', json))
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