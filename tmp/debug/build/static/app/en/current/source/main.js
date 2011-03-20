// ==========================================================================
// Project:   App
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals App */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
App.main = function main() {

    document.title = "REST Labs";

    App.getPath('mainPage.mainPane').append();

    //append the exp data from Explist fixture to the demoController
    var expListQuery = SC.Query.local(App.Explist, {
        orderBy: 'expID'
    });
    var list = App.store.find(expListQuery);
    App.expListController.set('content', list);
    App.designerController.set('content', list);

    //append the exp data from Prevexptask fixture to the prevexpController
    var prevQuery = SC.Query.local(App.Prevexptask, {
        orderBy: 'expName'
    });
    var prev = App.store.find(prevQuery);
    App.prevExpController.set('content', prev);

    //append the exp list from Admin_expList fixtures to the adminController
    var adminQuery = SC.Query.local(App.Admin_expList, {//May need to be changed in future
        orderBy: 'expName'
    });
    var admin = App.store.find(adminQuery);
    App.adminController.set('content', admin);

    //append the users from userEdit fixtures to the editUserController
    var userEditQuery = SC.Query.local(App.Useredit, {
        orderBy: 'userName'
    });
    var userEdit = App.store.find(userEditQuery);
    App.edituserController.set('content', userEdit);
    App.deleteUserController.set('content', userEdit);

    //append the schema list from Schema fixtures to the schemaController
    var schemaQuery = SC.Query.local(App.Schema, {
        orderBy: 'schemaID'
    });
    var schema = App.store.find(schemaQuery);
    App.schemaController.set('content', schema);

    var expAPI = SC.Query.local(App.ExpApi, {
        orderBy: 'dataDesc'
    });
    var api = App.store.find(expAPI);
    App.designerController.set('content', api);
};

function main() {
    App.main();
    var userCredential=SC.Cookie.find('userCredential');
    if( userCredential === null || userCredential.value === null)
        App.loginController.openPanel();
    else
    {
        App.loginController.checkUsersRole(userCredential.value);
        App.loginController.set('loginName',userCredential.value);
    }
}; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');