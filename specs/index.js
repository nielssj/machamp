import React from "react"
import Immutable from "immutable"
import TunnelRow from "../app/components/TunnelRow"

const TUNNEL = Immutable.fromJS({
  name: 'test',
  srcHost: '127.0.0.1',
  srcPort: 9090,
  dstHost: '127.0.0.1',
  dstPort: 9090
})

describe("MyComponent", function() {

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