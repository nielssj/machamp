
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

export function connectSSH() {
  return dispatch => {
    dispatch(requestConnectSSH())
    return setTimeout(() => {
      dispatch(confirmConnectSSH())
    }, 2000)
  }
}