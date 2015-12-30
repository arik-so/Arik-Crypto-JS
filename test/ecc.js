/**
 * Created by arik on 12/28/15.
 */

const assert = require('assert');
const ecc = require('../src/ecc');
const bitcore = require('bitcore-lib');

describe('ECC', function() {
	it('should verify format', function() {
		var keyPair = ecc.generateKeyPair();
		var publicKey = keyPair.public;
		var privateKey = keyPair.private;
		assert.equal(64, privateKey.length);
		assert.equal(66, publicKey.length);

		var privateKeyObject = new bitcore.PrivateKey();
		var publicKeyObject = privateKeyObject.toPublicKey();
		var publicKeyDER = publicKeyObject.toDER().toString('hex');
		var publicKeyString = publicKeyObject.toString();
		assert.equal(publicKeyDER, publicKeyString, 'verify format');
	});

	it('should sign and verify', function() {
		var keyPair = ecc.generateKeyPair();
		var publicKey = keyPair.public;
		var privateKey = keyPair.private;

		var original = 'Hello World!';
		var signature = ecc.sign(original, privateKey);
		var isValid = ecc.verify(signature, original, publicKey);
		assert(isValid);
	});

	it('should symmetrically encrypt and decrypt', function() {
		var keyPair1 = ecc.generateKeyPair();
		var keyPair2 = ecc.generateKeyPair();

		ecc.diffieHellman(keyPair1.public, keyPair2.private);
	});

	it('should test cross-platform Diffie Hellman', function() {
		var publicKey = '03d1dee0824bc8de9bc4320268c308ae0f25e85ab8a8be83be01b43992eafcbc3c';
		var privateKey = '686308ed8b6626c6e83b34d7fbfb44e0d46a9a876b6e37711cddb6474ee839e1';
		var diffieHellman = ecc.diffieHellman(publicKey, privateKey);
		assert.equal(diffieHellman, '027ac2a4bdac427eeab40fcd2ae0e3eee8fd48124b5524c9a8793614bb869c14d7');
	});

	/*it('should test cross-platform signing', function() {
		var publicKey = '03d1dee0824bc8de9bc4320268c308ae0f25e85ab8a8be83be01b43992eafcbc3c';
		var privateKey = '686308ed8b6626c6e83b34d7fbfb44e0d46a9a876b6e37711cddb6474ee839e1';
		var message = 'Hello, World!';
		var signature1 = ecc.sign(message, privateKey);
		var signature2 = ecc.sign(message, privateKey);
		var externalSignature1 = 'IKfN0Yxo47jGsurJO7cOm9HtpouuHg7iqhu84PJEjfHDH+zwaynuwPF4OMk5l1VitShFA+szI/Exl80Y9iaMTpY=';
		var verify1 = ecc.verify(externalSignature1, message, publicKey);
	});*/
});
