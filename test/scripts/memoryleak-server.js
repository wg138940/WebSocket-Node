process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// var heapdump = require('heapdump');
// var memwatch = require('memwatch');
import { readFileSync } from 'fs';
import { server as WebSocketServer } from '../../lib/websocket.js';
import { createServer } from 'https';

var activeCount = 0;

var config = { 
    key: readFileSync( 'privatekey.pem' ), 
    cert: readFileSync( 'certificate.pem' )  
};

var server = createServer( config );

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080 (wss)');
});

var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false    
});

wsServer.on('request', function(request) {
    activeCount++;
    console.log('Opened from: %j\n---activeCount---: %d', request.remoteAddresses, activeCount);
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            setTimeout(function() {
              if (connection.connected) {
                connection.sendUTF(message.utf8Data);
              }
            }, 1000);
        }       
    });
    connection.on('close', function(reasonCode, description) {
        activeCount--;
        console.log('Closed. (' + reasonCode + ') ' + description +
                    '\n---activeCount---: ' + activeCount);
        // connection._debug.printOutput();
    });
    connection.on('error', function(error) {
        console.log('Connection error: ' + error);
    });
});

// setInterval( function(){
//     // global.gc();
//     var filename = './heapdump/'+ new Date().getTime() + '_' + activeCount + '.heapsnapshot';
//     console.log('Triggering heapdump to write to %s', filename);
//     heapdump.writeSnapshot( filename );
// }, 10000 );
// memwatch.on('leak', function(info) { console.log(info); });
