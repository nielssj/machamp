import React, { Component } from 'react'
import { connect } from 'react-redux'
import {connectSSH} from "../actions/conncetionActions";

class App extends Component {
  onHelloClick() {
    this.props.dispatch(connectSSH())
  }

  renderConnectionIndicator() {
    let status = this.props.connection.get('status').toJS();
    if (status.isConnecting) {
      return <p>Connecting...</p>
    }
    if (status.isConnected) {
      return <p>Yay, Connected!</p>
    }
  }

  render() {
    console.log(JSON.stringify(this.props))
    let tunnels = this.props.tunnels
    let entry = tunnels.entries[0]
    return <div>
      <p onClick={this.onHelloClick.bind(this)}>Hello {entry.name}!</p>
      {this.renderConnectionIndicator()}
    </div>
  }
}

export default connect(state => state)(App)