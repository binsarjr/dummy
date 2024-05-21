module.exports = {
  apps: [
    {
      script: 'dist/main.js',
      name: 'dummy',
      env: {
        DATABASE_URL: 'file:./dev.db',
      },
    },
  ],
};
