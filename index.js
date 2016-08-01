var net = require('net');
var SSHClient = require('ssh2').Client;

var ssh = new SSHClient();

config = {
  ssh: {
    host: '46.101.123.204',
    port: 22,
    username: 'root',
    agent: '/run/user/1000/keyring/ssh'
  }
};

state = {
  exiting: false,
  tunnels: []
};

function makeTunnel(tunnelConfig, netConnection) {
  ssh.forwardOut(
    tunnelConfig.srcHost,
    tunnelConfig.srcPort,
    tunnelConfig.dstHost,
    tunnelConfig.dstPort, function(err, sshStream) {
      if (err) {
        netConnection.emit('error', err);
        return;
      }

      console.log('Tunnel created');
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

    makeTunnel(tunnelConfig, netConnection);

    netConnection.on('sshStream', function(sshStream) {
      sshStream.on('error', function() {
        server.close();
      });
    });

    netConnection.on('close', function() {
      connections.splice(connections.indexOf(this), 1);
    });

    connections.push(netConnection);
  });

  server.on('error', ssh.emit.bind(ssh, 'error'));

  server.on('close', function() {
    connections.forEach(function(connection) {
      connection.end();
    });
  });

  return server;
}

function startTunneling(tunnelConfig) {
  if (state.exiting) {
    return;
  }

  let server = createServer(tunnelConfig);

  tunnelConfig.server = server;
  state.tunnels.push(tunnelConfig);

  server.listen(tunnelConfig.srcPort, function(error) {
    console.log(`Started tunneling ${tunnelConfig.srcHost}:${tunnelConfig.srcPort} -> ${tunnelConfig.dstHost}:${tunnelConfig.dstPort}`);
    if(error) {
      console.error(error);
      process.exit(1);
    }
  });
}

ssh.on('ready', function() {
  console.log('SSH connection established');

  setTimeout(() => {
    console.log('Tunneling now possible');
    startTunneling({
      name: 'rethinkdb',
      srcHost: '127.0.0.1',
      srcPort: 9090,
      dstHost: '127.0.0.1',
      dstPort: 9090
    });
  }, 5000)
});

ssh.on('error', err => {
  console.log(err);
});

process.on('SIGINT', function () {
  console.log('\nexisting...');
  if (!state.exiting) {
    let tunnelsExited = 0;
    state.exiting = true;
    state.tunnels.forEach(tunnel => {
      tunnel.server.close();
      tunnel.server.on('close', (err) => {
        tunnel.server.closed = true;
        if (err) {
          tunnel.server.closeError = err;
        }

        tunnelsExited++;

        if (tunnelsExited == state.tunnels.length) {
          const errors = state.tunnels
            .filter(t => t.closeError)
            .map(t => t.closeError);
          if (errors.length > 0) {
            console.log('exited with error');
            errors.forEach(err => console.log(err.stack));
            process.exit(1);
          } else {
            console.log('exited gracefully');
            process.exit(0);
          }
        }
      })
    })

  } else {
    console.log('forcefully exited');
    process.exit(1);
  }
});

process.on('uncaughtException', function(e) {
  console.log('uncaught exception...');
  console.log(e.stack);
  process.exit(99);
});

ssh.connect(config.ssh);