import React, { Component } from 'react'
import styles from './ConnectionHeader.css'

class ConnectionHeader extends Component {

  renderConnectButton(status) {
    let buttonText = 'Connect';
    if (status.isConnecting) {
      buttonText = 'Connecting..'
    }
    if (status.isConnected) {
      buttonText = 'Disconnect'
    }
    return (
      <div className={styles.connectButton}>
        <a onClick={this.props.onConnectClick}>{buttonText}</a>
      </div>
    )
  }

  render() {
    let connection = this.props.connection.toJS();
    let width = this.props.width || '100%'
    return (
      <div style={{ width: width }} className={styles.root}>
        <div className={styles.connectionField}>
          <span> {connection.config.username}@{connection.config.host} </span>
        </div>
        {this.renderConnectButton(connection.status)}
      </div>
    )
  }
}

export default ConnectionHeader