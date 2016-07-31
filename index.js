var net = require('net');
var SSHClient = require('ssh2').Client;

var ssh = new SSHClient();

config = {
  ssh: {
    host: '46.101.123.204',
    port: 22,
    username: 'root',
    agent: '/run/user/1000/keyring/ssh'
  },
  tunnels: [
    {
      name: 'rethinkdb',
      srcHost: '127.0.0.1',
      srcPort: 9090,
      dstHost: '127.0.0.1',
      dstPort: 9090
    }
  ]
};

function bindssh(tunnelConfig, netConnection) {
  var ssh = new SSHClient();

  ssh.on('ready', function() {
    console.log('ssh:ready');
    netConnection.emit('ssh', ssh, netConnection);
    ssh.forwardOut(
      tunnelConfig.srcHost,
      tunnelConfig.srcPort,
      tunnelConfig.dstHost,
      tunnelConfig.dstPort, function(err, sshStream) {
        if (err) {
          // Bubble up the error => netConnection => server
          netConnection.emit('error', err);
          console.log('Destination port:', err);
          return;
        }

        console.log('sshStream:create');
        netConnection.emit('sshStream', sshStream);
        netConnection.pipe(sshStream).pipe(netConnection);
      });
  });
  return ssh;
}

function createServer(config) {
  var server,
    ssh,
    connections = [];

  server = net.createServer(function(netConnection) {
    netConnection.on('error', server.emit.bind(server, 'error'));
    server.emit('netConnection', netConnection, server);

    let port = netConnection.address().port;
    let tunnelConfig = config.tunnels.find(tc => tc.srcPort === port);

    ssh = bindssh(tunnelConfig, netConnection);
    ssh.on('error', server.emit.bind(server, 'error'));

    netConnection.on('sshStream', function(sshStream) {
      sshStream.on('error', function() {
        server.close();
      });
    });

    connections.push(ssh, netConnection);
    ssh.connect(config.ssh);
  });

  server.on('close', function() {
    connections.forEach(function(connection) {
      connection.end();
    });
  });

  return server;
}

server = createServer(config);
server.listen(9090, function(error) {
  if(error) {
    console.error(error);
    process.exit(1);
  }
});

server.on('error', err => {
  console.log(err);
});

let exiting = false;
process.on('SIGINT', function () {
  console.log('\nexisting...');
  if (!exiting) {
    exiting = true;
    server.close();
    server.on('close', (err) => {
      if (err) {
        console.log('exited with error');
        console.log(e.stack);
        process.exit(1);
      } else {
        console.log('exited gracefully');
        process.exit(0);
      }
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