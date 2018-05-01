'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var encryption = require('./libs/encryption.js');
var asymmetric_crypto = require('asymmetric-crypto');


console.debug(encryption);

var thisServer = this;

this.clients = [];
this.portNumber = process.argv[2] || 5050;
this.clientCount = 0;


http.listen(this.portNumber, function(){
    console.log('listening on ' + thisServer.portNumber);
}.bind(thisServer));

io.on('connection', function(socket){
    console.log('New client connected');
    var newClientId = thisServer.clientCount++;
    thisServer.clients[newClientId] = socket;
    thisServer.communicate(newClientId, 'init', 'Welcome to Encryption');

    socket.on('disconnect', function (message) {
        console.log('Client disconnected')
    });

    socket.on('encType', function (message) {
        console.log('in encType');
        var encType = message.encType;
        console.log(encType);

        if (encType == 1) {
            console.log('Running Symmetric Key Encryption');
            var key = 'a23s23da5sd67c8f9kjk0jh3rt5ntbm7ghqgwe23qwb4en5nqmhw643gjb3me23nn4kj5w6eh7r78g3we';
            var text = 'This is a test text for symmetric key encryption';
            console.log('Encryption text - ' + text);

            var encryptedResult = encryption.encrypt(text, key);
            console.log('Encrypted text result: ' + encryptedResult);
            var clientData = {
                encryptedResult: encryptedResult,
                encType: 1
            };
            thisServer.communicate(newClientId, 'clientData', clientData);
            console.log('Passed encrypted data to client');
        }
        else if (encType == 2) {
            console.log('Running Asymmetric Key Encryption');
            var keyPair = asymmetric_crypto.keyPair();
            var data = 'This is a test data for Asymmetric key encryption';

            // Encrypting the message
            var encrypted = asymmetric_crypto.encrypt(data, message.publicKey, keyPair.secretKey);
            // Signing the message
            var signature = asymmetric_crypto.sign(data, keyPair.secretKey);

            var message = {
                serverPublicKey: keyPair.publicKey,
                encryptedData: encrypted,
                signature: signature,
                encType: 2
            };

            thisServer.communicate(newClientId, 'clientData', message);

        }
    });



}.bind(thisServer));


this.communicate = function (clientId, channel, message) {
    this.clients[clientId].emit(channel, message, clientId);

};

this.broadcast = function (channel, message) {
    for (const clientId in this.clients) {
        this.communicate(clientId, channel, message);
    }
};

