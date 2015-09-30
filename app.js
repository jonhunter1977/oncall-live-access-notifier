var debug = require('debug')('oncall-live-access-notifier:app');
var config = require('./config/index');
var rabbitConfig = config.get('rabbit') || {};
var riverStyx = new require('./lib/rabbit')(rabbitConfig);
var events = require('./events');
var oncall = require('./lib/oncall.js');
var rundeck = require('./lib/rundeck.js');

var peopleInOnCallRota = config.get('oncallMappings');

debug(new Date(), 'Started oncall-live-access-notifier');

riverStyx.start().then(function(){
    debug(new Date(), 'Subscribing to queue');
    riverStyx.subscribe();
    events.on('victorops-oncall-message', function(message){
        var messageData = message.data.toString('utf8');
        var oncallrota = JSON.parse(messageData).message.oncall;

        debug(new Date(), 'Latest on call rota : ' + JSON.stringify(oncallrota));

        var accountsForLiveAccess = oncall.getAccountsForLiveAccess(oncallrota, peopleInOnCallRota);
        accountsForLiveAccess = accountsForLiveAccess.reduce(function(previousValue, currentValue, index, array){
            return previousValue + "," + currentValue;
        })

        debug(new Date(), 'Accounts to be enabled : ' + accountsForLiveAccess);

        var directory = config.get("rundeckJob:directory") || '';
        var host = config.get("rundeckJob:host") || '';
        var group = config.get("rundeckJob:group") || '';

        rundeck.runJob(config.get('rundeckJob:jobId'), '?argString=-dir ' + directory + ' -host ' + host + ' -group ' + group + ' -users ' + accountsForLiveAccess).then(function(data){
            debug(new Date(), 'Outcome of rundeck API call : ' + data)
        }).catch(function(err){
            debug(new Date(), "Error in rundeck API call: " + err);
            console.trace();
        });
    });
}).catch(function(err){
    debug(new Date(), "Error : " + err);
    console.trace();
});

