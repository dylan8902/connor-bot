var restify = require('restify');
var builder = require('botbuilder');
var website = require('./website');
var profile = require('./profile');

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

// Serve static website pages
website.serve(server);

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Create the bot with some universal handlers
var bot = new builder.UniversalBot(connector, [
  function (session, args, next) {
    // If we do not know the user's name, ask using dialog
    if (!session.userData.name) {
      session.beginDialog('profile');
    } else {
      next();
    }
  },
  function (session, results) {
    // Handle all text messages
    var text = session.message.text;

    // Default response if we cannot find any intents
    var response = session.userData.name + ' said: ' + text;

    // Search for intents
    if (text.match('time')) {
      response = new Date().toLocaleString();
    } else if (text.match('random')) {
      response = Math.floor(Math.random() * 100).toString();
    } else if (text.match('weather')) {
      response = 'It\'s raining';
    } else {
      console.log('unable to find any intent');
    }

    // Send response
    session.say(response, response, {
      inputHint: builder.InputHint.acceptingInput
    });
  }
]);

// Setup the profile dialog
profile.ask(bot);
