// ==========================================================================
// Project:   App.expListController
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  This controller is used for wiring up records from the experiment list model
  to the experiment selection view.

  @extends SC.ArrayController
*/

App.expListController = SC.ArrayController.create(SC.CollectionViewDelegate,
    /** @scope App.expListController.prototype */ {

    // orderBy: 'expID',

    indNum:'',
    expID:'',
    expType:'',

    // Returns experiment ID of selected experiment
    collectionViewShouldSelectIndexes: function(view, indexes, extend) {
        var ind = indexes.get('min');
        this.set('indNum', ind);
        return indexes;
    },

    //this function will destroy all the records in the Volatge Fixture
    destroyExpRecords: function() {
        var indRec = App.store.find(App.Voltage);

        indRec.forEach(function (record){
            record.destroy();
        }, this);
    },//end destroyExpRecords Function

    // Function for sending request to server to obtain experiment list
    showListContainer: function() {
        App.expSelectController.set('nowShowing', 'selectContainer');
        var userCredential=SC.Cookie.find('userCredential');
        var user = userCredential.value;
        var authCookie = SC.Cookie.find('SESS');
        SC.Request.getUrl('/rest/explist/' + user)
            .header({
                'Cookie': authCookie.name
            })
            .json()
            .notify(this, this.getExpList)
            .send();
    },

    // Callback function to put obtained experiment list into data store
    getExpList: function(response) {
        if (SC.ok(response)) {
            var data = response.get('body');
            App.store.createRecords(App.Explist, data.isEnumerable ? data : [data]);
        }
        App.prevExpController.getPreviousExpList();
    },

    obtainExpID: function() {
        var ind = this.get('indNum');

        if (ind !== '') {
            var indRec = App.store.find(App.Explist);
            var rec = indRec.objectAt(ind);
            var expID = rec.getEach('expID')[0];
            var expType = rec.getEach('expType');

            this.set('expID', expID);
            this.set('expType', expType);

            App.schemaController.showSchemaPanel(expID);
        } else
            alert('You need to select an experiment!');
    }
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');