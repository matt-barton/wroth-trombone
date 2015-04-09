"use strict"

module.exports = function (twitModule) {

	var twit = null

	return function(message, callback) {
		console.log(message)
		if (twit == null) twit = new twitModule({
			consumer_key: process.env.WROTH_TROMBONE_TWITTER_CONSUMER_KEY,
			consumer_secret: process.env.WROTH_TROMBONE_TWITTER_CONSUMER_SECRET,
			access_token: process.env.WROTH_TROMBONE_TWITTER_ACCESS_TOKEN,
  			access_token_secret: process.env.WROTH_TROMBONE_TWITTER_ACCESS_TOKEN_SECRET
		})
		message = 'PARP! ' + message
		twit.post('statuses/update', {status: message}, function() {
			if (typeof callback == 'function') callback(null)
		})
	}
}