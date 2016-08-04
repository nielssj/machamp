import {app, BrowserWindow, ipcMain} from 'electron';
import MachampCore from './core'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let core;

function initHandlers(core) {
  ipcMain.on('start-tunnel-message', (event, arg) => {
      core.startTunneling(arg)
        .then(() => event.sender.send('start-tunnel-reply'))
        .catch(err => {
          event.sender.send('start-tunnel-reply', 'TUNNEL_START_FAILED')
          console.log('Failed to start tunnel: ' + err);
        })
  })
  ipcMain.on('stop-tunnel-message', (event, arg) => {
    core.stopTunneling(arg.name)
      .then(() => event.sender.send('stop-tunnel-reply'))
      .catch(err => {
        event.sender.send('stop-tunnel-reply', 'TUNNEL_STOP_FAILED')
        console.log('Failed to stop tunnel: ' + err);
      })
  })
}

ipcMain.on('connect-ssh-message', (event, arg) => {
  if (!core) {
    core = new MachampCore({ ssh:arg });
    core.connect()
      .then(() => {
        initHandlers(core)
        event.sender.send('connect-ssh-reply')
      })
      .catch(err => {
        event.sender.send('connect-ssh-reply', 'CONNECTION_FAILED')
        console.log('Failed to connect SSH: ' + err);
      })
  } else {
    event.sender.send('connect-ssh-reply', 'ALREADY_CONNECTED')
  }
})