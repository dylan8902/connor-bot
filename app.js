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

// Serve an index page
server.get('/', function (req, res, next) {
  res.send('Hello World, I\'m Connor!');
  return next();
});

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
    session.send('%s said: %s', session.userData.name, session.message.text);
  }
]);

// Collect user information
bot.dialog('profile', [
  function (session) {
    builder.Prompts.text(session, 'Hi! I\'mConnor, what is your name?');
  },
  function (session, results) {
    session.userData.name = results.response;
    session.send('Hello %s!', session.userData.name);
    session.endDialog();
  }
]);
