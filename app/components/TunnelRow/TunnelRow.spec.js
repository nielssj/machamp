import React from "react"
import Immutable from "immutable"
import TunnelRow from "./TunnelRow"

const TUNNEL = Immutable.fromJS({
  name: 'RethinkDB',
  srcHost: '127.0.0.1',
  srcPort: 9090,
  dstHost: '127.0.0.1',
  dstPort: 9090
})


describe("TunnelRow", function() {

  before(() => {
    this.load( <TunnelRow tunnel={TUNNEL} /> );
  });

  it("connecting", () => {
    this.props({ tunnel: TUNNEL.set('isConnecting', true) })
  });

  it("connected", () => {
    this.props({ tunnel: TUNNEL.set('isConnected', true) })
  });

  it("connect function", () => {
    document.getElementsByClassName('uih-Component')[0].style.width = 500
    let connect = () => {
      this.props({ tunnel: TUNNEL.set('isConnecting', true) })
      setTimeout(() => {
        this.props({ tunnel: TUNNEL.set('isConnected', true) })
      }, 2000)
    }
    this.props({
      tunnel: TUNNEL,
      onEnableClick: connect
    })
  })
});
