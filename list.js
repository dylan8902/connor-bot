var builder = require('botbuilder');

module.exports = {
  dialog: function (bot) {

    // Collect user information
    bot.dialog('list', [
      function (session) {
        var question = 'What would you like to add to your list? (say finsh when complete)';
        builder.Prompts.text(session, question, {
          speak: question,
          retrySpeak: question,
          inputHint: builder.InputHint.expectingInput
        });
      },
      function (session, results) {
        // If the reult response is finish, exit list
        if (results.response.toLowerCase() == "finish") {
          console.log("Finished making list");
          session.endDialog();
        } else {
          session.userData.list.push(results.response);
          var response = 'Added ' + results.response;
          session.say(response, response, {
            inputHint: builder.InputHint.acceptingInput
          });
          session.replaceDialog('list');
        }
      }
    ]);

  }
}
