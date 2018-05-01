var crypto = require('crypto');


var encryption = module.exports = new function () {

    var algorithm = 'aes256';


    this.encrypt = function (text, key) {
        console.log('Encrypting with ' + key + ' using algorithm ' + algorithm);

        var inputEncoding = 'utf8';
        var outputEncoding = 'hex';

        var myKey = crypto.createCipher(algorithm, key);
        var encryptedText = myKey.update(text, inputEncoding, outputEncoding);
        encryptedText += myKey.final(outputEncoding);

        return encryptedText;
    };

    this.decrypt = function (encryptedText, key) {
        console.log('Decrypting with ' + key + ' using algorithm ' + algorithm);

        var inputEncoding = 'hex';
        var outputEncoding = 'utf8';

        var myKey = crypto.createCipher(algorithm, key);
        var decryptedText = myKey.update(encryptedText, inputEncoding, outputEncoding);
        console.log(decryptedText);
        decryptedText += myKey.final(outputEncoding);

        return decryptedText;
    };

};