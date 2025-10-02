module.exports = {
  apps: [{
    name: 'mini-woo',
    script: 'npm',
    args: 'start',
    cwd: '/opt/mini-woo',
    env: {
      PORT: 3001,
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
