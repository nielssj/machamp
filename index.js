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

    if (tunnelConfig) {
      ssh = makeTunnel(tunnelConfig, netConnection);

      netConnection.on('sshStream', function(sshStream) {
        sshStream.on('error', function() {
          server.close();
        });
      });

      netConnection.on('close', function() {
        connections.splice(connections.indexOf(this), 1);
      });

      connections.push(netConnection);
    } else {
      netConnection.end();
    }
  });

  server.on('close', function() {
    connections.forEach(function(connection) {
      connection.end();
    });
  });

  return server;
}

server = createServer(config);

ssh.on('ready', function() {
  console.log('SSH connection established');

  ssh.on('error', server.emit.bind(server, 'error'));

  server.listen(9090, function(error) {
    console.log('Local proxy server listening');
    if(error) {
      console.error(error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.log('Tunneling now possible');
    config.tunnels.push({
      name: 'rethinkdb',
        srcHost: '127.0.0.1',
      srcPort: 9090,
      dstHost: '127.0.0.1',
      dstPort: 9090
    });
  }, 5000)
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

ssh.connect(config.ssh);