var Botkit = require('botkit')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_mention'], function (bot, message) {
  bot.reply(message, 'Hello <@' + message.user + '>.')
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
      '`bot hi` for a simple message.\n' +
      '`bot attachment` to see a Slack attachment message.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears('Top sales people', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'The top 5 sales people for today are: \n' +
      'Bob Smith 18,000 USD\n' +
      'Julie Sanders 14,000 USD\n' +
      'Celia Cruthers 14,000 USD\n' +
      'Nathan Atkins 10,000 USD'
  bot.reply(message, help)
})

controller.hears(['Sales chart'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Here is your chart.'
  var attachments = [{
    fallback: text,
    pretext: 'Chart generated for you',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'http://aviatioexample.actuate.com:8700/iportal/iv;jsessionid=3625A2FC7EAEEECB8F7BB701235F83BE?__ivcmd=getimage&amp;__vp=Default+Volume&amp;Volume=Default+Volume&amp;__ivSessionId=1466605001293_3625A2FC7EAEEECB8F7BB701235F83BE&amp;__report=%2FHome%2Fflightdemo%2FInteractive+Chart+Filtering+Details.RPTDOCUMENT%3B1&amp;__imageID=%2Fdefault+volume%2F%2Fhome%2Fflightdemo%2Finteractive+chart+filtering+details.rptdocument%3B310323000100%2Fen_us%24%24%24%24file%3A%2F%2F%2Fhome%2Fec2-user%2FBIRTiHubVisualization%2Fmodules%2FBIRTiHub%2FiHub%2Fdata%2Fserver%2Ftmp%2FODS_22445_06222016_070610%2Factsn1%2Facws4%2Fcustom2b2600615576ff684a23.png&amp;connectionHandle=3zj%2Feo12%2BXL4NLH3KAqSrUvdxaSYvER1c6HpivlroCc0LUn81D5HtIvAaBBY3WPDHRV2ewlHp8tZO75O6blA2X3l9sCpuqwVCq7MEZx96wcVgMOyrqOmxDb5WMb1mBY284qEpyA9DDZnMba9usUQVuAjLcFWpiVm4%2BxISPUEPNErkxfoW4ovT8G3yjwNvQ0U3jtn%2Bj65%2Falg83SemEr1ihXfz12hK%2FQ%2FmKSyZv1wI4vUx%2BgAKkyd6fMtu1qMCJjH&amp;__mimetype=image%2Fpng',
    title_link: 'http://aviatioexample.actuate.com:8700/iportal/iv?__locale=en_US&__vp=Default%20Volume&volume=Default%20Volume&closex=true&__report=%2FHome%2Fflightdemo%2FInteractive%20Chart%20Filtering%20Details.RPTDOCUMENT%3B1',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

  controller.hears(['Sales report'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Here is your report.'
  var attachments = [{
    fallback: text,
    pretext: 'Report generated for you',
    title: 'Download the PDF.',
    title_link: 'http://aviatioexample.actuate.com:8700/iportal/executereport.do?__locale=en_US&__vp=Default%20Volume&volume=Default%20Volume&closex=true&__executableName=%2FPublic%2FUnshipped%20Orders%201H2013.rptdesign%3B1&__requesttype=immediate&__format=pdf&__wait=True&userID=flightdemo&password=Demo1234',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})

function login(server, username, password) {
    $('#output').html("");
    document.activeElement.blur();
    var uriLogin = "http://" + server + ":5000/ihub/v1/login";
    var loginbody = 'username=' + username + '&' + 'password=' + password;
    if (password) {
        loginbody = 'username=' + username + '&' + 'password=' + password;
    } else {
        loginbody = 'username=' + username;
    };
    $.ajax({
        type: 'POST',
        data: loginbody,
        url: uriLogin,
        dataType: 'json',
        crossDomain: true,
        success: function (data, status, jqXHR) {
            authToken = data.AuthId;
            $('#output').html("Login success");
            //after log in enable next steps
            document.getElementById('fileSelect').disabled = false;
            //optionally use this to include the authToken on all other Ajax requests
            //otherwise you must store it somewhere
            //$.ajaxSetup({
            //    headers: {'authToken': authToken}
            //    });
        },
        timeout: 7000,
        error: function (jqXHR, status, errorThrown) {
            if (jqXHR.status === 0) {
                $('#output').html("Server not found");
            } else if (jqXHR.status === 401) {
                $('#output').html("Authentication failure");
            } 
        }
    });
    return false;
};
