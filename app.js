var restify = require('restify');
var builder = require('botbuilder');
var website = require('./website');
var profile = require('./profile');
var list = require('./list');

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
    // Handle all text messages as lowercase
    var text = session.message.text.toLowerCase();

    // Default response if we cannot find any intents
    var response = session.userData.name + ' said: ' + text;

    // Search for intents
    if (text.match('time')) {
      response = new Date().toLocaleString();
    } else if (text.match('random')) {
      response = Math.floor(Math.random() * 100).toString();
    } else if (text.match('weather')) {
      response = 'It\'s raining';
    } else if (text.match('list')) {
      // If there is no list, create an empty list
      if (session.userData.list === undefined) {
        session.userData.list = [];
        response = undefined;
        session.beginDialog('list');
      } else if (text.match('add')) {
        response = undefined;
        session.beginDialog('list');
      } else {
        response = session.userData.list.toString();
      }
    } else {
      console.log('unable to find any intent');
    }

    // Send response if there is one
    if (response) {
      session.say(response, response, {
        inputHint: builder.InputHint.acceptingInput
      });
    }
  }
]);

// Setup the profile dialog
profile.dialog(bot);

// Setup the list dialog
list.dialog(bot);
