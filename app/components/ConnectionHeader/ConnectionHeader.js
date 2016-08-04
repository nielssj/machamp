import React, { Component } from 'react'

class ConnectionHeader extends Component {
  renderStatusIndicator(status) {
    if (status.isConnecting) {
      return <p>Connecting...</p>
    }
    if (status.isConnected) {
      return <p>Connected</p>
    }
    return <p>Not connected</p>
  }

  render() {
    let connection = this.props.connection.toJS();
    return (
      <div>
        <p>
          <strong><a onClick={this.props.onConnectClick}>Connect</a></strong>
          <span> {connection.config.username}@{connection.config.host} </span>
        </p>
        {this.renderStatusIndicator(connection.status)}
      </div>
    )
  }
}

export default ConnectionHeader