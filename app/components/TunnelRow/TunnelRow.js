import React, { Component } from 'react'
import styles from './TunnelRow.css'
import StatusCheckButton from '../StatusCheckButton/StatusCheckButton'

class TunnelRow extends Component {
  renderEnableButton(tunnel) {
    if (tunnel.isConnected) {
      return <StatusCheckButton state='checked' onClick={this.props.onDisableClick} />
    } else if (tunnel.isConnecting) {
      return <StatusCheckButton state='loading' />
    }
    return <StatusCheckButton onClick={this.props.onEnableClick} />
  }

  render() {
    const tunnel = this.props.tunnel.toJS()
    return (
      <li className={styles.root} key={tunnel.name}>
        <div className={styles.leftColumn}>
          { this.renderEnableButton(tunnel) }
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.title}>
            <span>{tunnel.name}</span>
          </div>
          <div className={styles.description} >8080 -> 27.382.92.289:8080</div>
        </div>
      </li>
    )
  }
}

export default TunnelRow