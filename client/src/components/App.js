import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
        <div>StellumCoin powered by Blockchain</div>
        <br />
        <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
        <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
        <br />
        <div className='WalletInfo'>
          <div>Address: {address}</div>
          <div>Balance: {balance}</div>
        </div>
      </div>
    );
  }
}

export default App;
