var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Serve some T and Cs
server.get('/privacy-terms', restify.serveStatic({
  directory: __dirname,
  file: 'privacy-terms.html'
}));

// Serve an index page
server.get('/', restify.serveStatic({
  directory: __dirname,
  file: 'index.html'
}));

// Serve image
server.get('/connor_240.png', restify.serveStatic({
  directory: './images',
  file: 'connor_240.png'
}));

// Listen for messages from users
server.post('/api/messages', connector.listen());

// The bot
var bot = new builder.UniversalBot(connector, [
  function (session, args, next) {
    if (!session.userData.name) {
      session.beginDialog('profile');
    } else {
      next();
    }
  },
  function (session, results) {
    var response = session.userData.name+ ' said: ' + session.message.text;
    session.say(response, response, {
      inputHint: builder.InputHint.acceptingInput
    });
  }
]);

// Collect user information
bot.dialog('profile', [
  function (session) {
    var question = 'Hi! I\'m Connor, what is your name?';
    builder.Prompts.text(session, question, {
      speak: question,
      retrySpeak: question,
      inputHint: builder.InputHint.expectingInput
    });
  },
  function (session, results) {
    session.userData.name = results.response;
    var response = 'Hello ' + session.userData.name;
    session.say(response, response, {
      inputHint: builder.InputHint.acceptingInput
    });
    session.endDialog();
  }
]);
