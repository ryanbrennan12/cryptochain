import React, { Component } from 'react';
import { log } from 'util';
import logo from '../assets/logo.png';


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
      <div className='App'>
        <img className='logo' src={logo}></img>
        <br />
        <div>Welcome to the blockchain...</div>
        <br />
        <div className="WalletInfo">
          <div>Address: {address}</div>
          <div>Balance: {balance}</div>
        </div>
        <br />
      </div>
    )
  }
}

export default App;