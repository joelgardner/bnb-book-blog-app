import React, { Component } from 'react'
import './App.css'
import * as api from './api'

class App extends Component {
  constructor() {
    super()
    this.state = {
      a: 0,
      b: 0,
      sum: null,
      error: null
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
        <span style={{ color:'#f00' }}>{this.state.error}</span>
      </div>
    )
  }

  async handleClick(a, b) {
    try {
      const result = await api.sum(a, b)
      this.setState({ sum: result, error: null })
    }
    catch (e) {
      this.setState({ error: e.toString(), sum: null })
    }
  }
}

export default App
