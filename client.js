'use strict';

var chalk = require('chalk');
var encryption = require('./libs/encryption.js');
var getUserInput = require('readline-sync');
var asymmetric_crypto = require('asymmetric-crypto');


var thisClient = this;

this.ipAddr = process.argv[2] || '127.0.0.1';
this.portNo = process.argv[3] || 5050;
this.ipUrl = 'http://' + this.ipAddr + ':' + this.portNo;
this.clientSocket = null;
this.clientId = null;

var connectToServer = function (thisClient) {

    var key = 'a23s23da5sd67c8f9kjk0jh3rt5ntbm7ghqgwe23qwb4en5nqmhw643gjb3me23nn4kj5w6eh7r78g3we';
    var keyPair = asymmetric_crypto.keyPair();

    thisClient.clientSocket = require('socket.io-client')(thisClient.ipUrl);

    thisClient.clientSocket.on('connect', function (socket) {
        console.log('Connected to ' + thisClient.ipAddr + ' ' + thisClient.portNo);
    }.bind(thisClient));

    thisClient.clientSocket.on('init', function (msg, clientId) {
        console.log(msg);
        thisClient.clientId = clientId;

        var validInput = false;
        while (validInput === false) {
            console.log(chalk.blue('Type 1- Symmetric Key Encryption, 2-Asymmetric Key Encription(Public key Algorithm):'));
            var userInput = getUserInput.question('>');
            //console.log('userInput '+userInput);

            if (userInput == 1 || userInput == 2) {
                validInput = true;
            }
            else {
                console.log(chalk.blue('Invalid input. (Type 1 or 2)...'));
            }
        }
        //console.log('Your clientId is '+ thisClient.clientId);

        var message = {
            clientId: thisClient.clientId,
            encType: userInput
        };
        if (userInput == 1) {
            thisClient.clientSocket.emit('encType', message);
        }
        else if (userInput == 2) {
            console.log(keyPair);
            message['publicKey'] = keyPair.publicKey;
            thisClient.clientSocket.emit('encType', message);
        }
    }.bind(thisClient));


    thisClient.clientSocket.on('clientData', function (message, clientId) {
        if (message.encType === 1) {
            console.log('Received Encrypted data from server - ' + message.encryptedResult);
            console.log('Trying to decrypt the data using Symmetric key encryption');
            var decryptedText = encryption.decrypt(message.encryptedResult, key);
            console.log('Decrypted text result: ' + decryptedText);
        }
        else if (message.encType === 2) {
            console.log('Received Encrypted data from server - ' + message.encryptedData.data);
            console.log('Trying to decrypt the data using Asymmetric key encryption');
            var decryptedText = asymmetric_crypto.decrypt(message.encryptedData.data, message.encryptedData.nonce,
                message.serverPublicKey, keyPair.secretKey);
            console.log('Decrypted text result: ' + decryptedText);
        }
    });
};

connectToServer(thisClient);