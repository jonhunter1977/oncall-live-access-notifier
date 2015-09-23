var debug = require('debug')('oncall-live-access-notifier:oncall-tests');
var expect = require('expect.js');
var oncall = require('../lib/oncall.js');

console.log(oncall);

describe('oncall', function () {

    describe('getAccountsForLiveAccess', function () {
        it('Should return jryan and knaveed', function () {

            var testConfig =  {
                "ssunkari" : "ssunkari",
                "selliot" : "selliot",
                "jryan" : "jryan",
                "mrkashif" : "knaveed",
                "tonybarton65" : "tbarton"
            };

            var testOnCallRota = [
                {"team":"Application Support","oncall":"jryan"},
                {"team":"System Support","oncall":"pcrombie"},
                {"team":"Database Support","oncall":"mrkashif"},
                {"team":"Duty Management","oncall":"itservicedesk"}
            ];

            var accountsForLiveAccess = oncall.getAccountsForLiveAccess(testOnCallRota, testConfig);
            var expectedResult = ['jryan','knaveed'];
            
            expect(accountsForLiveAccess).to.eql(expectedResult);
        });

        it('Should return tbarton', function () {

            var testConfig =  {
                "ssunkari" : "ssunkari",
                "selliot" : "selliot",
                "jryan" : "jryan",
                "mrkashif" : "knaveed",
                "tonybarton65" : "tbarton"
            };

            var testOnCallRota = [
                {"team":"Application Support","oncall":"jryan1"},
                {"team":"System Support","oncall":"pcrombie1"},
                {"team":"Database Support","oncall":"tonybarton65"},
                {"team":"Duty Management","oncall":"itservicedesk1"}
            ];

            var accountsForLiveAccess = oncall.getAccountsForLiveAccess(testOnCallRota, testConfig);
            var expectedResult = ['tbarton'];
            
            expect(accountsForLiveAccess).to.eql(expectedResult);
        });

        it('Should return an empty array if no matches are found in the test config', function () {

            var testConfig =  {
                "ssunkari" : "ssunkari",
                "selliot" : "selliot",
                "jryan" : "jryan",
                "mrkashif" : "knaveed",
                "tonybarton65" : "tbarton"
            };

            var testOnCallRota = [
                {"team":"Application Support","oncall":"jryan1"},
                {"team":"System Support","oncall":"pcrombie1"},
                {"team":"Database Support","oncall":"mrkashif1"},
                {"team":"Duty Management","oncall":"itservicedesk1"}
            ];

            var accountsForLiveAccess = oncall.getAccountsForLiveAccess(testOnCallRota, testConfig);
            var expectedResult = [];
            
            expect(accountsForLiveAccess).to.eql(expectedResult);
        }); 

        it('Should return an empty array if the config is empty', function () {

            var testConfig =  { };

            var testOnCallRota = [
                {"team":"Application Support","oncall":"jryan1"},
                {"team":"System Support","oncall":"pcrombie1"},
                {"team":"Database Support","oncall":"mrkashif1"},
                {"team":"Duty Management","oncall":"itservicedesk1"}
            ];

            var accountsForLiveAccess = oncall.getAccountsForLiveAccess(testOnCallRota, testConfig);
            var expectedResult = [];
            
            expect(accountsForLiveAccess).to.eql(expectedResult);
        });

        it('Should return an empty array if the oncall rota is an empty array', function () {

            var testConfig =  {
                "ssunkari" : "ssunkari",
                "selliot" : "selliot",
                "jryan" : "jryan",
                "mrkashif" : "knaveed",
                "tonybarton65" : "tbarton"
            };

            var testOnCallRota = [];

            var accountsForLiveAccess = oncall.getAccountsForLiveAccess(testOnCallRota, testConfig);
            var expectedResult = [];
            
            expect(accountsForLiveAccess).to.eql(expectedResult);
        });
    });

});