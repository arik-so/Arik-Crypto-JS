/**
 * Created by arik on 12/28/15.
 */

const assert = require('assert');
const aes = require('../src/aes');

describe('AES', function() {
	it('should encrypt and decrypt', function() {
		var key = aes.generateKey();
		var iv = aes.generateInitializationVector();
		var original = 'Hello World!';
		var encrypted = aes.encrypt(original, key, iv);
		var decrypted = aes.decrypt(encrypted, key, iv);
		assert.equal(decrypted, original, 'crypto works');
	});
	it('should test cross-platform decryption', function() {
		var key = 'WnoGDr4UUYT2kFsakX7KbPVnVQPCy8PoB6R+IqJg/kg=';
		var iv = 'xjx6Wsrhz+IJJASSZN4m0g==';
		var encrypted = 'Q4FBOYvZvWp/jzn8V7UgEQ==';
		var decrypted = aes.decrypt(encrypted, key, iv);
		var expected = 'Hello World!';
		assert.equal(decrypted, expected, 'cross-platform crypto works');
	});
	it('should test key derivation', function() {
		var input = 'presumablyADiffieHellmanResult';
		var derivation = aes.deriveKey(input);
		assert.equal(derivation, 'CfSmnHxb6DEdPg7+/+LmPrbHIjFb6e0Z5fzv+psTKSM=', 'derivation works');
	});
});
