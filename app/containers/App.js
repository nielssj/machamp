import React, { Component } from 'react'
import { connect } from 'react-redux'
import {connectSSH} from "../actions/conncetionActions";
import {startTunnel, stopTunnel} from "../actions/tunnelsActions";
import TunnelList from '../components/TunnelList/TunnelList';
import ConnectionHeader from '../components/ConnectionHeader/ConnectionHeader';

const style = {
  root: {
    backgroundColor: '#b4b6c2',
    height: '100%',
    width: '100%'
  }
}

class App extends Component {
  onHeaderConnectClick() {
    const connection = this.props.connection.toJS()
    this.props.dispatch(connectSSH(connection.config))
  }

  onEnableTunnelClick(tunnel) {
    this.props.dispatch(startTunnel(tunnel.toJS()))
  }

  onDisableTunnelClick(tunnel) {
    this.props.dispatch(stopTunnel(tunnel.toJS()))
  }

  render() {
    return (
      <div style={style.root}>
        <ConnectionHeader
          connection={this.props.connection}
          onConnectClick={this.onHeaderConnectClick.bind(this)}
        />
        <TunnelList
          tunnels={this.props.tunnels}
          onEnableTunnelClick={this.onEnableTunnelClick.bind(this)}
          onDisableTunnelClick={this.onDisableTunnelClick.bind(this)}
        />
      </div>
    )
  }
}

export default connect(state => state)(App)