var debug = require('debug')('oncall-live-access-notifier:lib:rabbit');
var amqp = require('amqp');
var Promise = require("bluebird");
var events = require('events');
var events = require('../events');

module.exports = function(options) {

    var _options = options || {};
    var _connection;
    var _connected = false;
    var _queue;
    var _exchangeName = (options.exchange !== undefined) ? options.exchange : 'rabbit-exchange';
    var _opened = false;

    var start = function(callback){

        return new Promise(function(resolve, reject){
            _connection = amqp.createConnection(_options.rabbitConfig);

            _connection.on('error', function(e) {
                debug(new Date(), 'Error connecting to rabbit mq : ' + e);
                console.trace();
                reject('Error connecting to rabbit mq : ' + e);
            });

            _connection.on('ready', function(){
                if(_connected) {  
                    return; 
                }
                _connected = true;

                debug(new Date(), 'Rabbit MQ Message bus has started.');

                _queue = _connection.queue(_options.queue, _connection.options, function(q){
                    q.bind(_options.exchange, _options.routingKey);
                    resolve();
                });
            });
        });
    };

    var subscribe = function(){
        _queue.subscribe(function(message, headers, deliveryInfo, messageObject){
            if(deliveryInfo.routingKey === _options.routingKey) {
                events.emit('victorops-oncall-message', message);
            }
        });
    };

    return {
        start : start,
        subscribe : subscribe
    }
};
