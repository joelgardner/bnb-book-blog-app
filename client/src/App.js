import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { sum } from './api'

class App extends Component {
  constructor() {
    super()
    this.state = {
      a: 0,
      b: 0,
      sum: null
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <span>A</span>
          <input type="number" defaultValue={this.state.a} onChange={e => this.setState({ a: e.target.value })} />
        </div>
        <div>
          <span>B</span>
          <input type="number" defaultValue={this.state.b} onChange={e => this.setState({ b: e.target.value })} />
        </div>
        <div>
          <button onClick={() => this.handleClick(this.state.a, this.state.b)}>Calculate!</button>
        </div>
        <span>{this.state.sum === null ? '' : `The sum is ${this.state.sum}`}</span>
      </div>
    );
  }

  async handleClick(a, b) {
     const result = await sum(a, b)
     this.setState({ sum: result })
  }
}

export default App;
