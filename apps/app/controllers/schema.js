// ==========================================================================
// Project:   App.schemaController
// Copyright: ©2011 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/

App.schemaController = SC.ArrayController.create(SC.CollectionViewDelegate,
    /** @scope App.schemaController.prototype */ {
    indx:'',
    schemaID:'',

    // Returns experiment ID of selected experiment
    collectionViewShouldSelectIndexes: function(view, indexes, extend) {
        var ind = indexes.get('min');
        this.set('indx',ind);

        return indexes;
    },

    // This function will destroy all the records in the Schema Fictures and
    // it will set all the global variables to the intializing value
    clearRecords: function() {
        this.set('indx','');
        var indRec = App.store.find(App.Schema);
        indRec.forEach(function (record) {
            record.destroy();
        }, this);
    },

    /** This function will do the following tasks:
     * 1.display the Template panel on the screen.
     * 2.send a request to the server to get the templates list .
     * 3.call the App.temControlor.sendTempID() function that will send a request to the server
     *	to get the JSON experiment UI.
     */
    showSchemaPanel: function(expid) {
        var pane = App.getPath('schemaPage.mainPane');
        var authCookie = SC.Cookie.find('SESS');

        pane.append(); // show on screen

        //send a reserver request to the server
        SC.Request.getUrl('/rest/ui/' + expid)
            .header({
                'Cookie': authCookie.name
            })
            .json()
            .notify(this, this.didRequestSchema)
            .send();
    },

    /**Upon receiving the response from the server this function will do :
     *  1. store this response into the schema fixture
     *  @Param response : the response from the server
     */
    didRequestSchema: function(response) {
        if (SC.ok(response)) {
            var data = response.get('body');
            console.log('Testing ' + data);
            App.store.createRecords(App.Schema, data.isEnumerable ? data : [data]);
        }
    },

    // This function will do the folowing tasks
    // 1. Upon selecting the schema name, this function will send a request to the
    //    lab server to get the UI schema in JSON format that are related to the experiment.
    getUI: function() {
        var ind = this.get('indx');
        if (ind !== '') {
            var indRec = App.store.find(App.Schema);
            var rec = indRec.objectAt(ind);
            this.set('schemaID', rec.getEach('schemaID'));
            var expID = App.expListController.get('expID');
            var authCookie = SC.Cookie.find('SESS');
            var resvMessage = expID + '/' + this.get('schemaID');
            //send a reserver request to the server
            SC.Request.getUrl('/rest/ui/' + resvMessage)
                .header({
                    'Cookie': authCookie.name
                })
                .json()
                .notify(this, this.didUI)
                .send();
        } else
            alert("You need to select a schema first!");
    },

    // This function will do the folowing tasks:
    // 1. Automatically switch to blank experiment control UI form
    //    and dynamically populate it with control and sensor objects
    // 2. Set the data from the response to the expJSON
    // 3. Check whether the experiment at the server is ready or not.
    // 4. Call the clearRecord function that will destroy the record from fixtures
    // 5. Remove the schema panel from the screen
    didUI: function(response) {
        var data = response.get('body');

        if (SC.ok(response)) {
            App.expSelectController.set('nowShowing','expContainer');
            this.clearRecords();
            App.getPath('schemaPage.mainPane').remove();

            App.expSelectController.set('expJSON',data);
            this.invokeLater(function() {
                App.expSelectController.createUIFromJSON();
            });
        }
    },

    // This function will do the folowing tasks:
    // 1. Remove the schema panel from the screen when the cancel buttom is clicked
    // 2. Call the ClearRecord function that will destroy the records from the fixtures
    cancel:function(){
        App.getPath('schemaPage.mainPane').remove();
        this.clearRecords();
    }
});
