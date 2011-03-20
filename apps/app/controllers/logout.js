// ==========================================================================
// Project:   App.logoutController
// Copyright: ©2011 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

        (Document Your Controller Here)

 @extends SC.ObjectController
 */

App.logoutController = SC.ObjectController.create(
    /** @scope App.logoutController.prototype */ {
    logOutMethod: function() {
        var authCookie = SC.Cookie.find('SESS');
        SC.Request.getUrl('/rest/logout' )
                .header({
            'Cookie': authCookie.name
        })
                .set('isJSON', YES)
                .notify(this, this.didResponse)
                .send();
    },


    didResponse:function(response){
        if (SC.ok(response)) {
            this.logOut();
        }
    },

    logOut: function() {
        var authCookie = SC.Cookie.find('SESS');
        App.loginController.set('loginName', '');
        App.loginController.set('loginPassword', '');
        App.adminController.destroyRecords();
        App.edituserController.destroyRecords();
        //destroy all the cookies .
        var authCookie = SC.Cookie.find('SESS');
        if (authCookie !== null)
            authCookie.destroy();

         var authCookie = SC.Cookie.find('userCredential');
        if (authCookie !== null)
            authCookie.destroy();

        App.expListController.set('indNum', '');
        App.prevExpController.set('pexIndNum', ''); // Initialise the index in the prevexpController.js

        App.schemaController.clearRecords();
        var query = SC.Query.local(App.Prevexptask);
        App.prevExpController.destroyData(query); // Destroy the record in the prevexp.js datastore

        var indRec = App.store.find(App.Explist);
        indRec.forEach(function(record) {
            record.destroy();
        }, App.demoController);

        App.expController.returnToDefaults();

        App.adminController.adminTabHide();
        App.loginController.openPanel();
    }
});