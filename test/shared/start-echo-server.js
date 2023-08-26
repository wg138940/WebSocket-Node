export default startEchoServer;
import path from 'path';
import childProcess from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startEchoServer(outputStream, callback) {
  if ('function' === typeof outputStream) {
    callback = outputStream;
    outputStream = null;
  }
  if ('function' !== typeof callback) {
    callback = function(){};
  }
  
  var serverPath = path.join(__dirname + '/../scripts/echo-server.js');
  
  console.log(serverPath);
    
  var echoServer = childProcess.spawn('node', [ serverPath ]);
  
  var state = 'starting';
  
  var processProxy = {
    kill: function(signal) {
      state = 'exiting';
      echoServer.kill(signal);
    }
  };
  
  if (outputStream) {
    echoServer.stdout.pipe(outputStream);
    echoServer.stderr.pipe(outputStream);
  }
  
  echoServer.stdout.on('data', function(chunk) {
    chunk = chunk.toString();
    if (/Server is listening/.test(chunk)) {
      if (state === 'starting') {
        state = 'ready';
        callback(null, processProxy);
      }
    }
  });

  echoServer.on('exit', function(code, signal) {
    echoServer = null;
    if (state !== 'exiting') {
      state = 'exited';
      callback(new Error('Echo Server exited unexpectedly with code ' + code));
      process.exit(1);
    }
  });

  process.on('exit', function() {
    if (echoServer && state === 'ready') {
      echoServer.kill();
    }
  });
}
