var config = require('../config/index');
var debug = require('debug')('oncall-live-access-notifier:lib:webrequest');
var Promise = require("bluebird");
var webRequest = require('request');

var isApiSecure = config.get('rundeckApi:isSecure') ? 'https://' : 'http://';

module.exports = function(){

  var callApi = function(options){ 
    
    return new Promise(function(resolve, reject){

      debug(new Date(), options);

      webRequest(options, function(error, response, body) {

          if (error) {
            debug(new Date(), 'Problem with webrequest : ' + error); 
            return reject(error);
          }

          resolve(body);
      });

    });
    
  };

  return {
    callApi : callApi
  };

}();