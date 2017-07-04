var restify = require('restify');

module.exports = {
  serve: function (server) {

    // Serve an index page
    server.get('/', restify.serveStatic({
      directory: __dirname,
      file: 'index.html'
    }));

    // Serve some T and Cs
    server.get('/privacy-terms', restify.serveStatic({
      directory: __dirname,
      file: 'privacy-terms.html'
    }));

    // Serve image
    server.get('/connor_240.png', restify.serveStatic({
      directory: './images',
      file: 'connor_240.png'
    }));

  }
}
