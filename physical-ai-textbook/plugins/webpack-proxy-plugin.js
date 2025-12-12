module.exports = function (context, options) {
  return {
    name: 'custom-webpack-proxy-plugin',
    configureWebpack(config, isServer, utils) {
      console.log('webpack-proxy-plugin: configureWebpack is running!');
      return {
        devServer: {
          proxy: [ // Corrected structure: array of proxy objects
            {
              context: ['/api'], // Specify the context for the proxy
              target: 'http://127.0.0.1:8000', // Your FastAPI backend
              changeOrigin: true,
              pathRewrite: { '^/api': '/api' }, // The FastAPI backend expects /api
              logLevel: 'debug', // Optional: 'debug', 'info', 'warn', 'error', 'silent'
            },
          ],
        },
      };
    },
  };
};