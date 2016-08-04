var net = require('net');
var SSHClient = require('ssh2').Client;

function makeTunnel(tunnelConfig, netConnection) {
  this.ssh.forwardOut(
    tunnelConfig.srcHost,
    tunnelConfig.srcPort,
    tunnelConfig.dstHost,
    tunnelConfig.dstPort, function(err, sshStream) {
      if (err) {
        netConnection.emit('error', err);
        return;
      }

      console.log('Connection tunneled'); // TODO: Remove this or reduce to DEBUG level
      netConnection.emit('sshStream', sshStream);
      netConnection.pipe(sshStream).pipe(netConnection);
    }
  );
}

function createServer(tunnelConfig) {
  var server, connections = [];

  server = net.createServer(function(netConnection) {
    netConnection.on('error', server.emit.bind(server, 'error'));
    server.emit('netConnection', netConnection, server);

    makeTunnel.bind(this)(tunnelConfig, netConnection);

    netConnection.on('sshStream', function(sshStream) {
      sshStream.on('error', function() {
        server.close();
      });
    });

    netConnection.on('close', function() {
      connections.splice(connections.indexOf(this), 1);
    });

    connections.push(netConnection);
  }.bind(this));

  server.on('error', this.ssh.emit.bind(this.ssh, 'error'));

  server.on('close', function() {
    connections.forEach(function(connection) {
      connection.end();
    });
  });

  return server;
}

class MachampCore {
  constructor(config) {
    this.ssh = new SSHClient();
    this.config = config;
    this.exiting = false;
    this.tunnels = [];

    this.ssh.on('error', err => {
      console.log(err);
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ssh.on('error', reject);
      this.ssh.on('ready', () => {
        this.ssh.removeListener('error', reject);
        resolve();
      });

      this.ssh.connect(this.config.ssh);
    })
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      let tunnelsExited = 0;
      this.exiting = true;
      this.tunnels.forEach(tunnel => {
        tunnel.server.close();
        tunnel.server.on('close', (err) => {
          tunnel.server.closed = true;
          if (err) {
            tunnel.server.closeError = err;
          }

          tunnelsExited++;

          if (tunnelsExited == this.tunnels.length) {
            const errors = this.tunnels
              .filter(t => t.closeError)
              .map(t => t.closeError);
            if (errors.length > 0) {
              reject(errors);
            } else {
              resolve()
            }
          }
        })
      })
    });
  }

  isDisconnecting() {
    return this.exiting;
  }

  startTunneling(tunnel) {
    return new Promise((resolve, reject) => {
      if (this.exiting) {
        return reject(new Error("Disconnecting, no more tunnels can be started"));
      }

      let server = createServer.bind(this)(tunnel);

      tunnel.server = server;
      this.tunnels.push(tunnel);

      server.listen(tunnel.srcPort, function(error) {
        console.log(`Started tunneling ${tunnel.srcHost}:${tunnel.srcPort} -> ${tunnel.dstHost}:${tunnel.dstPort}`);
        if(error) {
          return reject(error);
        }
        resolve(error);
      });
    });
  }

  stopTunneling(name) {
    return new Promise((resolve, reject) => {
      if (this.exiting) {
        return reject(new Error("Disconnecting, tunnel will be stopped as part of disconnect procedure"));
      }

      const tunnel = this.tunnels.find(t => t.name == name);
      tunnel.server.close();

      tunnel.server.on('close', (err) => {
        if(err) {
          return reject(err);
        }
        this.tunnels.splice(this.tunnels.indexOf(tunnel), 1);
        console.log(`Stopped tunneling ${tunnel.srcHost}:${tunnel.srcPort} -> ${tunnel.dstHost}:${tunnel.dstPort}`);
        resolve();
      });
    });
  }
}

module.exports = MachampCore;