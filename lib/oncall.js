var debug = require('debug')('oncall-live-access-notifier:lib:oncall');
var config = require('../config/index');

module.exports = function() {

    var getAccountsForLiveAccess = function(oncallrota, peopleInOnCallRota) {

        var accountsForLiveAccess = [];

        oncallrota.forEach(function(element, index, array){
            if(peopleInOnCallRota.hasOwnProperty(element.oncall)) {
                debug(new Date(), 'Adding ' + peopleInOnCallRota[element.oncall] + ' to on call access list');
                accountsForLiveAccess.push(peopleInOnCallRota[element.oncall]);
            }
            else {
                debug(new Date(), element.oncall + ' was not added to on call access list');
            }
        })

        return accountsForLiveAccess;
    };

    return {
        getAccountsForLiveAccess : getAccountsForLiveAccess
    }

}();