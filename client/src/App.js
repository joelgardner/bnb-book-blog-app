import React, { Component } from 'react'
import './App.css'
import * as api from './api'

class App extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      id: null
    }
  }

  render() {
    return (
      <div className="App">
        <div>Create user:</div>
        <div>
          <span>Email</span>
          <input type="text" defaultValue={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
        </div>
        <div>
          <button onClick={() => this.handleClick(this.state.email)}>Create User</button>
        </div>
        <span>{this.state.id === null ? '' : `The user's ID is ${this.state.id}`}</span>
        <span style={{ color:'#f00' }}>{this.state.error}</span>
      </div>
    )
  }

  async handleClick(email) {
    const result = await api.createUser(email)
    if (result.errors) {
      this.setState({ error: result.errors[0].message, id: null })
    }
    else {
      this.setState({ email: result.data.createUser.email, id: result.data.createUser.id, error: null })
    }
  }
}

export default App
