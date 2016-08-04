import { ipcRenderer } from 'electron'

function requestStartTunnel(tunnel) {
  return {
    type: 'REQUEST_START_TUNNEL',
    tunnel
  }
}

function confirmStartTunnel(tunnel) {
  return {
    type: 'CONFIRM_START_TUNNEL',
    tunnel
  }
}

function requestStopTunnel(tunnel) {
  return {
    type: 'REQUEST_STOP_TUNNEL',
    tunnel
  }
}

function confirmStopTunnel(tunnel) {
  return {
    type: 'CONFIRM_STOP_TUNNEL',
    tunnel
  }
}

export function startTunnel(tunnel) {
  return dispatch => {
    dispatch(requestStartTunnel(tunnel))
    ipcRenderer.once('start-tunnel-reply', (event, arg) => {
      dispatch(confirmStartTunnel(tunnel))
    })
    ipcRenderer.send('start-tunnel-message', tunnel)
  }
}

export function stopTunnel(tunnel) {
  return dispatch => {
    dispatch(requestStopTunnel(tunnel))
    ipcRenderer.once('stop-tunnel-reply', (event, arg) => {
      dispatch(confirmStopTunnel(tunnel))
    })
    ipcRenderer.send('stop-tunnel-message', tunnel)
  }
}