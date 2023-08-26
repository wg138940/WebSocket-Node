import { createServer } from 'http';
import WebSocketServer from '../../lib/WebSocketServer.js';

var server;
var wsServer;

export function prepare(callback) {
  if (typeof(callback) !== 'function') { callback = function(){}; }
  server = createServer(function(request, response) {
    response.writeHead(404);
    response.end();
  });

  wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
    maxReceivedFrameSize: 64*1024*1024,   // 64MiB
    maxReceivedMessageSize: 64*1024*1024, // 64MiB
    fragmentOutgoingMessages: false,
    keepalive: false,
    disableNagleAlgorithm: false
  });

  server.listen(64321, function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, wsServer);
  });
}

export function stopServer() {
  try {
    wsServer.shutDown();
    server.close();
  }
  catch(e) {
    console.warn('stopServer threw', e);
  }
}

