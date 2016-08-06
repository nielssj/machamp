import React from "react"
import Immutable from "immutable"
import ConnectionHeader from "./ConnectionHeader"

const INITIAL_STATE = Immutable.fromJS({
  config: {
    host: '46.101.123.204',
    port: 22,
    username: 'root',
    agent: '/run/user/1000/keyring/ssh'
  },
  status: {
    isConnecting: false,
    isConnected: false
  }
});

describe("ConnectionHeader", function() {
  before(() => {
    let disconnect = () => {
      this.props({
        connection: INITIAL_STATE.setIn(['status', 'isConnected'], false),
        onConnectClick: connect
      })
    }
    let connect = () => {
      this.props({ connection: INITIAL_STATE.setIn(['status', 'isConnecting'], true) })
      setTimeout(() => {
        this.props({
          connection: INITIAL_STATE.setIn(['status', 'isConnected'], true),
          onConnectClick: disconnect
        })
      }, 1000)
    }
    this.component(
      <div style={{width: 550}}>
        <ConnectionHeader
          connection={INITIAL_STATE}
          onConnectClick={connect}
        />
      </div>
    );
  });
});
