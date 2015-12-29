/**
 * Created by arik on 12/28/15.
 */

const assert = require('assert');
const rsa = require('../src/rsa');

describe('RSA', function() {
	it('should encrypt and decrypt', function() {
		var keyPair = rsa.generateKeyPair();
		var publicKey = keyPair.public;
		var privateKey = keyPair.private;

		var original = 'Hello World!';
		var encrypted = rsa.base64EncryptWithPublic(publicKey, original);
		var decrypted = rsa.decryptBase64WithPrivate(privateKey, encrypted);
		assert.equal(decrypted, original, 'content should be equal after encryption and decryption');
	});

	it('should generate keypair in the background', function(done) {
		rsa.generateKeyPairAsync()
		.then(function(keyPair){
			var publicKey = keyPair.public;
			var privateKey = keyPair.private;

			var original = 'Hello World!';
			var encrypted = rsa.base64EncryptWithPublic(publicKey, original);
			var decrypted = rsa.decryptBase64WithPrivate(privateKey, encrypted);
			assert.equal(decrypted, original, 'content should be equal after encryption and decryption');
			done();
		});
	})
});
