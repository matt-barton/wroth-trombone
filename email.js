"use strict"

module.exports = function(nodemailer, smtpTransport) {

	var transport = null

	function createTransport() {
		if (transport != null) return
		transport = nodemailer.createTransport(smtpTransport({
			host: process.env.WROTH_TROMBONE_EMAIL_SMTP_HOST,
			port: process.env.WROTH_TROMBONE_EMAIL_SMTP_PORT,
			auth: {
				user: process.env.WROTH_TROMBONE_EMAIL_USERNAME,
				pass:process.env.WROTH_TROMBONE_EMAIL_PASSWORD
			}
		}))
	}

	function error (callback) {
		createTransport()
		transport.sendMail({
			from:    process.env.WROTH_TROMBONE_EMAIL_FROM,
			to:      process.env.WROTH_TROMBONE_EMAIL_RECIPIENT,
			subject: 'Wroth Trombone: Error',
			text:    'This is the Wroth Trombone.  I encountered an error reading the Scum Filter from Wroth.'
		}, function() {
			if (typeof callback == 'function') return callback()
		})
	}

	function resumption(callback) {
		createTransport()
		transport.sendMail({
			from:    process.env.WROTH_TROMBONE_EMAIL_FROM,
			to:      process.env.WROTH_TROMBONE_EMAIL_RECIPIENT,
			subject: 'Wroth Trombone: Service Resumed',
			text:    'This is the Wroth Trombone.  Previous errors have cleared, and service has resumed.'
		}, function() {
			if (typeof callback == 'function') return callback()
		})
	}

	return {
		error: error,
		resumption: resumption
	}
}