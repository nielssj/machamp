import React, { Component } from 'react'

class TunnelRow extends Component {
  renderEnableButton(tunnel) {
    if (tunnel.isConnected) {
      return <strong onClick={this.props.onDisableClick} >disable</strong>
    } else {
      return <strong onClick={this.props.onEnableClick} >enable</strong>
    }
  }

  renderConnectionStatus(tunnel) {
    if (tunnel.isConnecting) {
      return <span> - Connecting..</span>
    } else if (tunnel.isConnected) {
      return <span> - Connected</span>
    }
  }

  render() {
    const tunnel = this.props.tunnel.toJS()
    return (
      <li key={tunnel.name}>
        { this.renderEnableButton(tunnel) }
        <span> {tunnel.name}</span>
        { this.renderConnectionStatus(tunnel) }
      </li>
    )
  }
}

export default TunnelRow