import React, { Component } from 'react';
import Block from './Block';

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
      console.log('RESULTS', results)
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
            <Block key={block.hash} block={block} />
          )
        })}
      </div>
    )
  }
}

{/* <Block key={block.hash} block={block}/> */}

export default Blocks;

