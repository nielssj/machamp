import Immutable from 'immutable'

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

const connection = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'REQUEST_CONNECT_SSH':
      return state.merge({
        status: { isConnecting: true }
      })
      break;
    case 'CONFIRM_CONNECT_SSH':
      return state.merge({
        status: { isConnecting: false, isConnected: true }
      })
      break;
    default:
      return state;
  }
}

export default connection