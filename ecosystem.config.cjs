module.exports = {
  apps: [{
    name: 'redesigned-memory',
    script: 'app.mjs',
    cwd: '/home/jacecalvert04/redesigned-memory',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
