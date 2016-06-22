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

controller.hears('sales data', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'The top 5 sales people for today are: \n' +
      'Bob Smith 18,000 USD\n' +
      'Julie Sanders 14,000 USD\n' +
      'Celia Cruthers 14,000 USD\n' +
      'Nathan Atkins 10,000 USD'
  bot.reply(message, help)
})

controller.hears(['sales chart'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Here is your chart.'
  var attachments = [{
    fallback: text,
    pretext: 'Chart generated for you',
    title: '',
    //image_url: 'https://core.opentext.com/pdfjs/web/viewer.html?shortLink=69f2882a6a81b20a4657bd30f27e79374cd89918533be113',
    image_url: 'https://core.opentext.com/api/v1/s/69f2882a6a81b20a4657bd30f27e79374cd89918533be113/contents/?access_token=undefined',
    title_link: '',
    text: text,
    color: '#7CD197'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

  controller.hears(['sales report'], ['direct_message', 'direct_mention'], function (bot, message) {
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
