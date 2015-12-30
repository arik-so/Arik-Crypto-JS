/**
 * Created by arik on 12/29/15.
 */

const crypto = require('crypto');

module.exports = {

	generateKey: function() {
		return crypto.randomBytes(32).toString('base64');
	},

	generateInitializationVector: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	encrypt: function(data, key, iv) {

		var rawKey = new Buffer(key, 'base64');
		var rawIV = new Buffer(iv, 'base64');

		var cipher = crypto.createCipheriv('aes-256-cbc', rawKey, rawIV);
		cipher.update(new Buffer(data));
		return cipher.final('base64');

	},

	decrypt: function(data, key, iv) {

		var rawKey = new Buffer(key, 'base64');
		var rawIV = new Buffer(iv, 'base64');

		var cipher = crypto.createDecipheriv('aes-256-cbc', rawKey, rawIV);
		cipher.update(new Buffer(data, 'base64'));
		return cipher.final('utf8');

	},

	deriveKey: function(input) {
		return crypto.createHash('sha256').update(input).digest('base64');
	}

};
