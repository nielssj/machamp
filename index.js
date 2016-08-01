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

core.connect()
  .then(() => {
    console.log('SSH connection established');

    setTimeout(() => {
      core.startTunneling({
          name: 'test',
          srcHost: '127.0.0.1',
          srcPort: 9090,
          dstHost: '127.0.0.1',
          dstPort: 9090
        })
        .then(() => console.log('Tunneling now possible'))
        .catch(err => console.log('Failed to start tunnel: \n' + err.stack));
    }, 500);

    setTimeout(() => {
      core.stopTunneling('test')
        .then(() => console.log('Tunneling no longer possible'))
        .catch(err => console.log('Failed to stop tunnel: \n' + err.stack));
    }, 5000);
  })
  .catch(err => {
    console.log('Failed to make SSH connection');
    console.log(err.stack);
    process.exit(1);
  });

process.on('SIGINT', function () {
  console.log('\nexisting...');
  if (!core.isDisconnecting()) {
    core.disconnect()
      .then(() => {
        console.log('exited gracefully');
        process.exit(0);
      })
      .catch(errors => {
        console.log('exited with error');
        errors.forEach(err => console.log(err.stack));
        process.exit(1);
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
