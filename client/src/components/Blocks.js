import React, { Component } from 'react';

class Blocks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blocks: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/blocks')
    .then(res => res.json())
    .then((results) => {
      this.setState({
        blocks: results
      })
    })
  }

  render() {
    console.log('heyyy', this.state)
    return (
      <div>
        <h3>Blocks</h3>
        {this.state.blocks.map((block, i) => {
          return (
            <div key={i}>{block.hash}</div>
          )
        })}
      </div>
    )
  }
}


export default Blocks;