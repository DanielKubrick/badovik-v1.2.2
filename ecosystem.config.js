module.exports = {
  apps: [
    {
      name: 'miniwoo',
      script: 'npm',
      args: 'start',
      cwd: '/opt/mini-woo',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/root/.pm2/logs/miniwoo-error.log',
      out_file: '/root/.pm2/logs/miniwoo-out.log',
      log_file: '/root/.pm2/logs/miniwoo-combined.log'
    }
  ]
};
