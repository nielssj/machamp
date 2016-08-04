import React from "react"
import Immutable from "immutable"
import TunnelList from "./TunnelList"

const TUNNELS = Immutable.fromJS({
  entries: [
    {
      name: 'mongodb',
      srcHost: '127.0.0.1',
      srcPort: 9090,
      dstHost: '127.0.0.1',
      dstPort: 9090
    },
    {
      name: 'gateway',
      srcHost: '127.0.0.1',
      srcPort: 9091,
      dstHost: '127.0.0.1',
      dstPort: 9091
    }
  ]
})

describe("TunnelList", function() {

  before(() => {
    this.load( <TunnelList
      tunnels={TUNNELS}
      onEnableTunnelClick={() => null}
      onDisableTunnelClick={() => null}
    /> );
  });
});
