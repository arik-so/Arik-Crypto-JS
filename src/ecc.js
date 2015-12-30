/**
 * Created by arik on 12/28/15.
 */

const bitcore = require('bitcore-lib');
const Message = require('bitcore-message');

module.exports = {

	generateKeyPair() {
		var privateKey = new bitcore.PrivateKey();
		var publicKey = privateKey.toPublicKey();

		var keyPairObject = {};
		keyPairObject.private = privateKey.toString();
		keyPairObject.public = publicKey.toString();
		keyPairObject.getPrivateKey = function() {
			return this.private;
		};
		keyPairObject.getPublicKey = function() {
			return this.public;
		};

		return keyPairObject;
	},

	sign(data, privateKey) {
		var privateKeyObject = new bitcore.PrivateKey(privateKey);
		var messageObject = new Message(data);
		var signature = messageObject.sign(privateKeyObject);
		return signature;
	},

	verify(signature, original, publicKey){
		var messageObject = new Message(original);
		var publicKeyObject = new bitcore.PublicKey(publicKey);
		var address = publicKeyObject.toAddress();
		var isVerified = messageObject.verify(address, signature);
		return isVerified;
	},

	diffieHellman(publicKey, privateKey) {
		var privateKeyObject = new bitcore.PrivateKey(privateKey);
		var publicKeyObject = new bitcore.PublicKey(publicKey);
		var point = publicKeyObject.point;
		var factor = privateKeyObject.toBigNumber();
		var secretPoint = point.mul(factor);
		var secretKey = bitcore.PublicKey.fromPoint(secretPoint);
		var secretKeyString = secretKey.toString();
		return secretKeyString;
	}

};
