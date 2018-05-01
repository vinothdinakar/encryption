var crypto = require('crypto');


var encryption = module.exports = new function () {

    var algorithm = 'aes256';

    this.encrypt = function (text, key) {
        console.log('Encrypting with key - ' + key + ' using algorithm ' + algorithm);

        var inputEncoding = 'utf8';
        var outputEncoding = 'hex';

        var encryptor = crypto.createCipher(algorithm, key);
        var encryptedText = encryptor.update(text, inputEncoding, outputEncoding);
        encryptedText += encryptor.final(outputEncoding);

        return encryptedText;
    };

    this.decrypt = function (encryptedText, key) {
        console.log('Decrypting with key - ' + key + ' using algorithm ' + algorithm);

        var inputEncoding = 'hex';
        var outputEncoding = 'utf8';

        var decryptor = crypto.createDecipher(algorithm, key);
        var decryptedText = decryptor.update(encryptedText, inputEncoding, outputEncoding);
        console.log(decryptedText);
        decryptedText += decryptor.final(outputEncoding);

        return decryptedText;
    };

};