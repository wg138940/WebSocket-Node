import server from './WebSocketServer.js'
import client from './WebSocketClient.js'
import router from './WebSocketRouter.js'
import frame from './WebSocketFrame.js'
import request from './WebSocketRequest.js'
import connection from './WebSocketConnection.js'
import w3cwebsocket from './W3CWebSocket.js'
import deprecation from './Deprecation.js'
import version from './version.js';

export default {
    'server'       : server,
    'client'       : client,
    'router'       : router,
    'frame'        : frame,
    'request'      : request,
    'connection'   : connection,
    'w3cwebsocket' : w3cwebsocket,
    'deprecation'  : deprecation,
    'version'      : version
};
