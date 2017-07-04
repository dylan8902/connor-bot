var builder = require('botbuilder');

module.exports = {
  ask: function (bot) {

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

  }
}
