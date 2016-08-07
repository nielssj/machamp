import React, { Component } from 'react'
import styles from './TunnelRow.css'

class TunnelRow extends Component {
  renderEnableButton(tunnel) {
    let circleStyle = styles.iconCircle
    let onClick = this.props.onEnableClick;
    let icon = null;
    let hideIcon = styles.hidden;

    if (tunnel.isConnected) {
      circleStyle = styles.iconCircleOK;
      onClick = this.props.onDisableClick;
      hideIcon = ''
      icon = 'fa-check'
    } else if (tunnel.isConnecting) {
      circleStyle = styles.iconCircle;
      onClick = null;
      icon = 'fa-hourglass-start' // TODO: Do animation instead
      hideIcon = ''
    }

    return (
      <div className={styles.iconContainer}>
        <svg viewBox="0 0 120 120">
          <circle onClick={onClick} className={circleStyle} cx="60" cy="60" r="50"/>
        </svg>
        <i
          className={`${styles.iconCheckMark} ${icon} ${hideIcon} fa fa-lg`}
          onClick = {onClick}
        />
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