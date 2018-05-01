'use strict';

var chalk = require('chalk');
var encryption = require('./libs/encryption.js');


var thisClient = this;

this.ipAddr = process.argv[2] || '127.0.0.1';
this.portNo = process.argv[3] || 5050;
this.ipUrl = 'http://' + this.ipAddr + ':' + this.portNo;
this.clientSocket = null;
this.clientId = null;

var connectToServer = function (thisClient) {

    var key = 'a23s23da5sd67c8f9kjk0jh3rt5ntbm7ghqgwe23qwb4en5nqmhw643gjb3me23nn4kj5w6eh7r78g3we';

    thisClient.clientSocket = require('socket.io-client')(thisClient.ipUrl);

    thisClient.clientSocket.on('connect', function (socket) {
        console.log('Connected to ' + thisClient.ipAddr + ' ' + thisClient.portNo);
    }.bind(thisClient));

    thisClient.clientSocket.on('init', function (msg, clientId) {
        console.log(msg);
        thisClient.clientId = clientId;
        //console.log('Your clientId is '+ thisClient.clientId);
    }.bind(thisClient));


    thisClient.clientSocket.on('encMess', function (message, clientId) {
        console.log('Message received from server - ' + message);

        var decryptedText = encryption.decrypt(message, key);
        console.log('Decrypted text result: ' + decryptedText);

    });
};

connectToServer(thisClient);