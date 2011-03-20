// ==========================================================================
// Project:   App.prevExpController
// Copyright: ©2011 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/

App.prevExpController = SC.ArrayController.create(SC.CollectionViewDelegate,
    /** @scope App.prevExpController.prototype */ {
    pexIndNum:'',
    expNo:'',
    dataContent:[SC.Object.create({})],
    nowShowing: 'prevExpContainer',

    collectionViewShouldSelectIndexes: function(view, indexes, extend) {
        App.prevExpController.set('indNum','');
        var ind = indexes.get('min');
        this.set('pexIndNum',ind);
        return indexes;
    },

    destroyData: function(query) {
        var indRec = App.store.find(query);
        indRec.forEach(function (record) {
            record.destroy();
        }, this);
    },

    //this function to get the previous data if the user had from the experiment
    getPreviousExpList: function() {
        var authCookie = SC.Cookie.find('SESS');
        var userCredential=SC.Cookie.find('userCredential');
        var user = userCredential.value; ;

        SC.Request.getUrl('/rest/data/' + user)
            .set('isJSON',YES)
            .header({
                'Cookie': authCookie.name
            })
            .notify(this, this.didFetchExpList)
            .send();
    },

    //This function to retrieve the previouse experiment data from the lab server
    didFetchExpList: function(response) {
        if (SC.ok(response)) {
            var data = response.get('body');
            var expNo = data.getEach('expNo');
            var expDesc = [];
            var jsonExpDesc = [];

            for (var i = 0; i < data.length; i++) {
                var startDate = new Date(parseInt(data.getEach('startTime')[i]));
                expDesc[i] = data.getEach('expName')[i] + " Start: " + startDate;
            }

            for (var k = 0 ; k < data.length; k++) {
                jsonExpDesc[k] = {
                    "expNo": expNo[k],
                    "expDesc": expDesc[k]
                };
            }

            App.store.createRecords(App.Prevexptask, jsonExpDesc.isEnumerable ? jsonExpDesc : [jsonExpDesc]);
        }
    },

    //this function to get the previous data if the user had from the experiment
    getExpData: function() {
        var indx = this.get('pexIndNum');
        if (indx!== '') {
            App.prevExpController.set('nowShowing', 'dataListContainer');
            var indRec = App.store.find(App.Prevexptask);
            var rec = indRec.objectAt(indx);
            this.set('expNo', rec.getEach('expNo'));
            var authCookie = SC.Cookie.find('SESS');
            var user = App.loginController.get('loginName');
            var resvMessage = user + "/" + this.get('expNo');
            SC.Request.getUrl('/rest/data/' + resvMessage)
                .header({
                    'Cookie': authCookie.name
                })
                .set('isJSON',YES)
                .notify(this, this.didFetchExpData)
                .send();
        } else
            alert("You need to select an experiment to connect!");
    },

    //This function to retrieve the previouse experiment data from the lab server
    didFetchExpData: function(response) {
        if (SC.ok(response)) {
            var data = response.get('body');
            //var timeList = data.getEach('time');
            for( var i=0; i < data.length; i++){
                var msDate = data.getEach('time')[i]; // .get('time')
                var formDate = new Date(parseInt(msDate));
                data[i].time = formDate;
            }
            App.store.createRecords(App.Expdata, data.isEnumerable ? data : [data]);
            var expListQuery = SC.Query.local(App.Expdata, {
                orderBy:'time'
            });

            var list = App.store.find(expListQuery);
//            var dataList = [];
//
//            for (var i = 0; i < list.length(); i++) {
//                var dataTime = new Date(parseInt(list.getEach('time')[i]));
//                dataList[i] = dataTime + " Type: " + list.getEach('dataType')[i] + " Voltage: " + list.getEach('dataVal')[i];
//            }
            this.set('dataContent', list);
        }
    },

    backToExpView: function() {
        App.prevExpController.set('nowShowing', 'prevExpContainer'); // Direct the user back to the expList container.
        var query = SC.Query.local(App.Expdata);
        this.destroyData(query);
    }
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');