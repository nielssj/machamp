import React, { Component } from 'react'
import styles from './StatusCheckButton.css';

class StatusCheckButton extends Component {
  render() {
    let state = this.props.state
    let onClick = this.props.onClick
    let circleStyle, icon;

    switch(state) {
      case 'loading':
        circleStyle = styles.circle
        icon = 'fa-hourglass-start'
        break;
      case 'checked':
        circleStyle = styles.circleOk
        icon = 'fa-check'
        break;
      case 'error':
        circleStyle = styles.circleError
        icon = 'fa-exclamation'
        break;
      default:
        circleStyle = styles.circle
        icon = ''
    }

    return (
      <div className={styles.container}>
        <svg viewBox="0 0 120 120">
          <circle onClick={onClick} className={circleStyle} cx="60" cy="60" r="50"/>
        </svg>
        <i className={`${styles.icon} ${icon} fa fa-lg`} onClick = {onClick} />
      </div>
    )
  }
}

export default StatusCheckButton