const MachampCore = require('./core');

config = {
  ssh: {
    host: '46.101.123.204',
    port: 22,
    username: 'root',
    agent: '/run/user/1000/keyring/ssh'
  }
};

const core = new MachampCore(config);

core.connect(function(err) {
  if(err) {
    console.log('Failed to make SSH connection');
    console.log(err.stack);
    return process.exit(1);
  }

  console.log('SSH connection established');

  setTimeout(() => {
    core.startTunneling({
      name: 'rethinkdb',
      srcHost: '127.0.0.1',
      srcPort: 9090,
      dstHost: '127.0.0.1',
      dstPort: 9090
    });
    console.log('Tunneling now possible');
  }, 500);

  setTimeout(() => {
    core.stopTunneling('rethinkdb');
    console.log('Tunneling no longer possible');
  }, 5000);
});

process.on('SIGINT', function () {
  console.log('\nexisting...');
  if (!core.isDisconnecting()) {
    core.disconnect(errors => {
      if(errors) {
        console.log('exited with error');
        errors.forEach(err => console.log(err.stack));
        process.exit(1);
      } else {
        console.log('exited gracefully');
        process.exit(0);
      }
    });
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