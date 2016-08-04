import Immutable from 'immutable'

const INITIAL_STATE = Immutable.fromJS({
  entries: [
    {
      name: 'test',
      srcHost: '127.0.0.1',
      srcPort: 9090,
      dstHost: '127.0.0.1',
      dstPort: 9090
    }
  ]
})

const tunnels = (state = INITIAL_STATE, action) => {
  let id;
  switch(action.type) {
    case 'REQUEST_START_TUNNEL':
      id = state.get('entries').findIndex(e => e.get('name') == action.tunnel.name)
      return state.updateIn(['entries', id], e => e.set('isConnecting', true))
      break
    case 'CONFIRM_START_TUNNEL':
      id = state.get('entries').findIndex(e => e.get('name') == action.tunnel.name)
      return state.mergeIn(['entries', id],
        {
          'isConnecting': false,
          'isConnected': true
        }
      )
      break
    case 'CONFIRM_STOP_TUNNEL':
      id = state.get('entries').findIndex(e => e.get('name') == action.tunnel.name)
      return state.updateIn(['entries', id], e => e.set('isConnected', false))
      break
    default:
      return state;
  }
}

export default tunnels