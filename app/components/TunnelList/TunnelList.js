import React, { Component } from 'react'
import TunnelRow from '../TunnelRow';

class TunnelList extends Component {
  render() {
    let entries = this.props.tunnels.get('entries');
    return (
      <ul>
        {
          entries.map(tunnel =>
            <TunnelRow
              key={tunnel.get('name')}
              tunnel={tunnel}
              onEnableClick={this.props.onEnableTunnelClick.bind(this, tunnel)}
              onDisableClick={this.props.onDisableTunnelClick.bind(this, tunnel)}
            />
          )
        }
      </ul>
    )
  }
}

export default TunnelList