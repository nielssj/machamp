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
    return (
      <svg className={styles.iconContainer} viewBox="0 0 120 120">
        <circle onClick={onClick} className={circleStyle} cx="60" cy="60" r="50"/>
      </svg>
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
            <i className="fa fa-check"/>
          </div>
          <div className={styles.description} >8080 -> 27.382.92.289:8080</div>
        </div>
      </li>
    )
  }
}

export default TunnelRow