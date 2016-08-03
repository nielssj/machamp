import React, { Component } from 'react'
import { connect } from 'react-redux'

class App extends Component {
  render() {
    console.log(JSON.stringify(this.props))
    let tunnels = this.props.tunnels
    let entry = tunnels.entries[0]
    return <p>Hello {entry.name}!</p>
  }
}

export default connect(state => state)(App)