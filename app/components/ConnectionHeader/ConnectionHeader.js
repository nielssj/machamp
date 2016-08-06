import React, { Component } from 'react'

const style = {
  headerRoot: {
    backgroundColor: '#3c5c5c',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    padding: 12
  },
  headerConnectionField: {
    fontFamily: 'sans-serif',
    backgroundColor: '#293f3f',
    color: '#85cccc',
    fontWeight: 'bold',
    borderRadius: 4,
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    marginRight: 12
  },
  connectButton: {
    fontFamily: 'sans-serif',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'white',
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    marginRight: 10,
    cursor: 'pointer'
  }
}

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
      <div style={style.connectButton}>
        <a onClick={this.props.onConnectClick}>{buttonText}</a>
      </div>
    )
  }

  render() {
    let connection = this.props.connection.toJS();
    return (
      <div style={style.headerRoot}>
        <div style={style.headerConnectionField}>
          <span> {connection.config.username}@{connection.config.host} </span>
        </div>
        {this.renderConnectButton(connection.status)}
      </div>
    )
  }
}

export default ConnectionHeader