import React, { Component } from 'react'
import TunnelRow from '../TunnelRow/TunnelRow';
import styles from './TunnelList.css';

class TunnelList extends Component {
  render() {
    let entries = this.props.tunnels.get('entries');
    return (
      <ul className={styles.root}>
        {
          entries.map(tunnel =>
            <TunnelRow
              key={tunnel.get('name')}
              tunnel={tunnel}
              onEnableClick={this.props.onEnableTunnelClick.bind(null, tunnel)}
              onDisableClick={this.props.onDisableTunnelClick.bind(null, tunnel)}
            />
          )
        }
      </ul>
    )
  }
}

export default TunnelList