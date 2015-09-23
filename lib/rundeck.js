var debug = require('debug')('oncall-live-access-notifier:lib:rundeck');
var webrequest = require('../lib/webrequest.js');
var config = require('../config/index.js');

var isApiSecure = config.get('rundeckApi:isSecure') ? 'https://' : 'http://';
var hostname = config.get('rundeckApi:host') + ':' + config.get('rundeckApi:port');

module.exports = function(){

    var runJob = function(jobId, queryString){
        return new Promise(function(resolve, reject){
            var options = {
              url: isApiSecure + hostname + "/api/1/job/" + jobId + "/run" + queryString,
              method: "GET",
              headers: {
                "X-Rundeck-Auth-Token": config.get('rundeckCredentials:apiKey')
              }
            };

            webrequest.callApi(options).then(function(data){
              resolve(data);
            }).catch(function(err){
              reject(err);
            })
        });
    };

    return {
        runJob : runJob
    };

}();
