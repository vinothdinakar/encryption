var crypto = require('crypto');


var encryption = module.exports = new function () {

    var algorithm = 'aes256';
    var inputEncoding = 'utf8';
    var outputEncoding = 'hex';

    this.encrypt = function (text, key) {
        console.log('Encrypting with key - ' + key + ' using algorithm ' + algorithm);

        var encryptor = crypto.createCipher(algorithm, key);
        var encryptedText = encryptor.update(text, inputEncoding, outputEncoding);
        encryptedText += encryptor.final(outputEncoding);

        return encryptedText;
    };

    this.decrypt = function (encryptedText, key) {
        console.log('Decrypting with key - ' + key + ' using algorithm ' + algorithm);

        var decryptor = crypto.createDecipher(algorithm, key);
        var decryptedText = decryptor.update(encryptedText, outputEncoding, inputEncoding);
        console.log(decryptedText);
        decryptedText += decryptor.final(inputEncoding);

        return decryptedText;
    };

};