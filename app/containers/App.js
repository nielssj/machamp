import React, { Component } from 'react'
import { connect } from 'react-redux'
import {connectSSH} from "../actions/conncetionActions";

class App extends Component {
  onHelloClick() {
    this.props.dispatch(connectSSH())
  }

  renderConnectionHeader() {
    let connection = this.props.connection.toJS();
    return (
      <div>
        <p>
          <strong><a onClick={this.onHelloClick.bind(this)}>Connect</a></strong>
          <span> {connection.config.username}@{connection.config.host} </span>
        </p>
      </div>
    )
  }

  renderConnectionIndicator() {
    let status = this.props.connection.get('status').toJS();
    if (status.isConnecting) {
      return <p>Connecting...</p>
    }
    if (status.isConnected) {
      return <p>Connected</p>
    }
    return <p>Not connected</p>
  }

  renderTunnelList() {
    let entries = this.props.tunnels.entries;
    return (
      <ul>
        {
          entries.map(tunnel => {
            return (
              <li key={tunnel.name}>
                <strong>enable</strong>
                <span> {tunnel.name}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }

  render() {
    console.log(JSON.stringify(this.props))
    return <div>
      {this.renderConnectionHeader()}
      {this.renderConnectionIndicator()}
      <hr />
      {this.renderTunnelList()}
    </div>
  }
}

export default connect(state => state)(App)