/**
 * Created by arik on 12/28/15.
 */

const ursa = require('ursa');
const cp = require('child_process');
const Promise = require('bluebird');

const GENERATE_KEY_PAIR_MESSAGE = 'GENERATE_KEY_PAIR_MESSAGE';

function encryptWithPublic(publicPEM, data) {

	var publicKeyObject = ursa.createPublicKey(publicPEM, 'utf8');
	var encryptedData = publicKeyObject.encrypt(data, undefined, undefined, ursa.RSA_PKCS1_PADDING);

	return encryptedData;

}

function encryptWithPrivate(privatePEM, data) {

	var privateKeyObject = ursa.createPrivateKey(privatePEM, '', 'utf8');
	var encryptedData = privateKeyObject.privateEncrypt(data);

	return encryptedData;

}

function decryptWithPrivate(privatePEM, data) {

	var privateKeyObject = ursa.createPrivateKey(privatePEM, '', 'utf8');
	var decryptedData = privateKeyObject.decrypt(data, undefined, undefined, ursa.RSA_PKCS1_PADDING);

	return decryptedData;

}

function decryptWithPublic(publicPEM, data) {

	var publicKeyObject = ursa.createPublicKey(publicPEM, 'utf8');
	var decryptedData = publicKeyObject.publicDecrypt(data);

	return decryptedData;

}

process.on('message', function(message) {

	// make sure this only listens to messages if the file itself is the worker root
	var moduleFile = process.mainModule.filename;
	if (moduleFile !== __filename) {
		// this is irrelevant
		return;
	}

	if(message == GENERATE_KEY_PAIR_MESSAGE) {
		var keyPair = module.exports.generateKeyPair();
		process.send(keyPair);
	}

	process.exit();

});

module.exports = {

	generateKeyPair: function() {

		var keyPair = ursa.generatePrivateKey(4096, 65537);

		var privatePEM = keyPair.toPrivatePem('utf8');
		var publicPEM = keyPair.toPublicPem('utf8');

		var keyPairObject = {};
		keyPairObject.private = privatePEM;
		keyPairObject.public = publicPEM;
		keyPairObject.getPrivateKey = function() {
			return this.private;
		};
		keyPairObject.getPublicKey = function() {
			return this.public;
		};

		return keyPairObject;

	},

	generateKeyPairAsync: function() {
		return new Promise(function(resolve, reject) {
			// we fork a child process with the same file
			var clone = cp.fork(__filename);
			clone.on('message', function(message) {
				resolve(message);
			});
			clone.send(GENERATE_KEY_PAIR_MESSAGE);
		});

	},

	base64EncryptWithPublic: function(publicPEM, data) {

		var encryptedData = encryptWithPublic(publicPEM, data);
		return new Buffer(encryptedData, 'hex').toString('base64');

	},

	decryptBase64WithPrivate: function(privatePEM, data) {

		var dataBuffer = new Buffer(data, 'base64');
		var decryptedData = decryptWithPrivate(privatePEM, dataBuffer);

		return new Buffer(decryptedData, 'hex').toString('utf8');

	},

	base64EncryptWithPrivate: function(privatePEM, data) {

		var encryptedData = encryptWithPrivate(privatePEM, data);
		return new Buffer(encryptedData, 'hex').toString('base64');

	},

	decryptBase64WithPublic: function(publicPEM, data) {

		var dataBuffer = new Buffer(data, 'base64');
		var decryptedData = decryptWithPublic(publicPEM, dataBuffer);

		return new Buffer(decryptedData, 'hex').toString('utf8');

	}

};
