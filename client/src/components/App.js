import React, { Component } from 'react';
import Blocks from './Blocks';
import { log } from 'util';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      walletInfo: ''
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/wallet-info')
    .then(res => res.json())
    .then((results) => {
      this.setState({
        walletInfo: results
      })
    })
  }
  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div>

        <div>Address: {address}</div>
        <div>Balance: {balance}</div>
        <br />
        <Blocks />
      </div>
    )
  }
}

export default App;