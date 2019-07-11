import React, { Component } from 'react';
import Block from './Block';
import { Link } from 'react-router-dom';

class Blocks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blocks: []
    }
  }

  componentDidMount() {
    fetch(`${document.location.origin}/api/blocks`)
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
      <div><Link to='/'>Home</Link></div>
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

