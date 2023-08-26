export function noop(){ /* NOOP */ };
import { Buffer } from 'buffer';

export function extend(dest, source) {
    for (var prop in source) {
        dest[prop] = source[prop];
    }
}

import { EventEmitter } from 'events';
import createDebugger from '../vendor/debug/index.js';

export const eventEmitterListenerCount =
    EventEmitter.listenerCount ||
    function(emitter, type) { return emitter.listeners(type).length; };

export const bufferAllocUnsafe = Buffer.allocUnsafe ?
    Buffer.allocUnsafe :
    function oldBufferAllocUnsafe(size) { return new Buffer(size); };

export const bufferFromString = Buffer.from ?
    Buffer.from :
    function oldBufferFromString(string, encoding) {
      return new Buffer(string, encoding);
    };

export const setImmediateImpl = ('setImmediate' in global) ?
    global.setImmediate.bind(global) :
    process.nextTick.bind(process);

const _BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
    var logFunction = createDebugger(identifier);
    if (logFunction.enabled) {
        var logger = new BufferingLogger(identifier, uniqueID, logFunction);
        var debug = logger.log.bind(logger);
        debug.printOutput = logger.printOutput.bind(logger);
        debug.enabled = logFunction.enabled;
        return debug;
    }
    logFunction.printOutput = noop;
    return logFunction;
};
export { _BufferingLogger as BufferingLogger };

function BufferingLogger(identifier, uniqueID, logFunction) {
    this.logFunction = logFunction;
    this.identifier = identifier;
    this.uniqueID = uniqueID;
    this.buffer = [];
}

BufferingLogger.prototype.log = function() {
  this.buffer.push([ new Date(), Array.prototype.slice.call(arguments) ]);
  return this;
};

BufferingLogger.prototype.clear = function() {
  this.buffer = [];
  return this;
};

BufferingLogger.prototype.printOutput = function(logFunction) {
    if (!logFunction) { logFunction = this.logFunction; }
    var uniqueID = this.uniqueID;
    this.buffer.forEach(function(entry) {
        var date = entry[0].toLocaleString();
        var args = entry[1].slice();
        var formatString = args[0];
        if (formatString !== (void 0) && formatString !== null) {
            formatString = '%s - %s - ' + formatString.toString();
            args.splice(0, 1, formatString, date, uniqueID);
            logFunction.apply(global, args);
        }
    });
};
