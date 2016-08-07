import React, { Component } from 'react'
import styles from './TunnelRow.css'

class TunnelRow extends Component {
  renderEnableButton(tunnel) {
    let circleStyle = styles.iconCircleError
    let onClick = this.props.onEnableClick;
    if (tunnel.isConnected) {
      circleStyle = styles.iconCircleOK;
      onClick = this.props.onDisableClick;
    } else if (tunnel.isConnecting) {
      circleStyle = styles.iconCircle;
      onClick = null;
    }
    let checkMark = <i
      className={styles.iconCheckMark + " fa fa-check fa-lg"}
      onClick = {this.props.onDisableClick}
    />
    return (
      <div className={styles.iconContainer}>
        <svg viewBox="0 0 120 120">
          <circle onClick={onClick} className={circleStyle} cx="60" cy="60" r="50"/>
        </svg>
        {tunnel.isConnected ? checkMark : ''}
      </div>
    )
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