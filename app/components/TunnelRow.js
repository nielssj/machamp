import React, { Component } from 'react'

class TunnelRow extends Component {
  render() {
    const tunnel = this.props.tunnel.toJS()
    return <li key={tunnel.name}>
      {
        tunnel.isConnected ?
          <strong onClick={this.props.onDisableClick} >disable</strong> :
          <strong onClick={this.props.onEnableClick} >enable</strong>
      }
      <span> {tunnel.name}</span>
      { tunnel.isConnecting ? <span> - Connecting..</span> : '' }
      { tunnel.isConnected ? <span> - Connected</span> : '' }
    </li>
  }
}

export default TunnelRow