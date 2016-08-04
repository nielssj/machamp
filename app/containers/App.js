import React, { Component } from 'react'
import { connect } from 'react-redux'
import {connectSSH} from "../actions/conncetionActions";
import {startTunnel} from "../actions/tunnelsActions";

class App extends Component {
  onHelloClick() {
    const connection = this.props.connection.toJS()
    this.props.dispatch(connectSSH(connection.config))
  }

  onEnableTunnelClick(tunnel) {
    this.props.dispatch(startTunnel(tunnel))
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
    let entries = this.props.tunnels.get('entries').toJS();
    return (
      <ul>
        {
          entries.map(tunnel => {
            return (
              <li key={tunnel.name}>
                <strong onClick={this.onEnableTunnelClick.bind(this, tunnel)} >enable</strong>
                <span> {tunnel.name}</span>
                { tunnel.isConnecting ? <span> - Connecting..</span> : '' }
                { tunnel.isConnected ? <span> - Connected</span> : '' }
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