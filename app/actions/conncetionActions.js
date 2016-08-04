import { ipcRenderer} from 'electron'

function requestConnectSSH() {
  return {
    type: 'REQUEST_CONNECT_SSH'
  }
}

function confirmConnectSSH() {
  return {
    type: 'CONFIRM_CONNECT_SSH'
  }
}

export function connectSSH(config) {
  return dispatch => {
    dispatch(requestConnectSSH())
    ipcRenderer.once('connect-ssh-reply', (event, arg) => {
      dispatch(confirmConnectSSH())
    })
    ipcRenderer.send('connect-ssh-message', config)
  }
}