// ==========================================================================
// Project:   App.adminController
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

        (Document Your Controller Here)

 @extends SC.ArrayController
 */

App.adminController = SC.ArrayController.create(SC.CollectionViewDelegate,
    /** @scope App.adminController.prototype */ {

    expList:'',
    userName:'',
    password:'',
    confPass:'',
    firstName:'',
    lastName:'',
    course :'',
    uni :'',
    type:'User',
    errorMessage: '',
    nowShowing: 'adminContainer',

    // This function will show the selection container
    // for the UI designer
    showDesignSelection: function() {
        this.set('nowShowing','selectContainer');
    },

    showDesignerCanvas: function() {
        this.set('nowShowing','designerContainer');
        //App.designerController.createPanes();
    },

    //Will be deleted at the end
    // This function is to view the admin container
    showAdminContainer: function() {
        //   App.welcomeController.set('nowShowing', 'adminContainer');
    },

    //This function is to append the account page and show it on the screen
    createAccount: function() {
        var pane = App.getPath('accountPage.mainPane');
        pane.append(); // show on screen
        pane.makeFirstResponder(pane.contentView.user); // focus first field
    },

    //This function is to clear all the field from the account page
    clearFields:function(){
        this.set('userName','');
        this.set('password','');
        this.set('confPass','');
        this.set('firstName','');
        this.set('lastName','');
        this.set('course','');
        this.set('uni','');
        this.set('errorMessage', '');
    },

    //This function will destroy all the record in the admin fixture
    destroyRecords:function() {
        var query = SC.Query.local(App.Admin_expList);
        var indRec = App.store.find(query);
        indRec.forEach(function(record) {
            record.destroy();
        }, this);
    },

    /* When the next Button is triggered.
     * This function will send a request to the lab server regarding to the expList
     * @Param userName : the userName from the textField
     * @Param Password : the password from the textField
     * if the user name field or the password field is emtpy Then  throw an error message
     * if the password dose not match the  confPass field Then throw an error message
     */
    next: function() {
        try {
            var userName = this.get('userName');
            var password = this.get('password');
            var confPassword = this.get('confPass');

            if (userName == null || userName == '') {
                throw SC.Error.desc('Username is required!');
            } else  if (password == null || password == '') {
                throw SC.Error.desc('Password is required!');
            } else if(password !== confPassword){
                throw SC.Error.desc('Passwords fields does not match!');
            } else {
                var authCookie = SC.Cookie.find('SESS');
                SC.Request.getUrl('/rest/explist')
                        .header({
                    'Cookie': authCookie.name
                })
                        .json()
                        .notify(this, this.didFetched)
                        .send();
            }
        }
        catch (err) {
            // Set an error message to the user
            this.set('errorMessage', err.message);
        }
    },//end Function

    /* Upon recieving a response from the lab server
     * This function will add the expList to the admin fixture
     * @param response: the response from the lab server
     */
    didFetched: function(response) {
        if (SC.ok(response)) {
            var data = response.get('body');
            var len = data.getEach('expName').length;
            for (var i = 0; i < len;i++)
                data[i].isDone = false;
            App.store.createRecords(App.Admin_expList, data.isEnumerable ? data : [data]);
            App.getPath('accountPage.mainPane').remove();
            var pane = App.getPath('expListPage.mainPane');
            pane.append();
        }
    },

    /* check whether is the experiment is been selected or not
     * @return YES if been selected or NO if not been selected
     */
    toggleDone: function() {
        var sel = this.get('selection');
        sel.setEach('isDone', !sel.everyProperty('isDone'));
        return YES;
    },

    /* This function is to send a request to the lab server regarding to creating a new account
     * @Param userName: the user name
     * @Param password : the password
     * @Param confpassword : the confirmation password
     * if every thing is ok Then send a request to the lab server
     * That's contain a body[userAccount(user,Password,name)] and
     * the header[Coockies(session Key)].
     */
    submit: function() {
        var userName = this.get('userName');
        var password = this.get('password');
        var hashPass = App.loginController.hashPassword(password);
        var fName = this.get('firstName');
        var lName = this.get('lastName') ;
        var uni = this.get('uni');
        var course = this.get('course');
        var type = this.get('type');
        var userAccount = [{
            'user': userName,
            'pass': hashPass,
            'type': type,
            'first': fName,
            'last' : lName,
            'uni': uni,
            'course': course
        }];
        // find the cookie
        var authCookie = SC.Cookie.find('SESS');
        // get the record from the admin_expList fixture

        // send a POST request to the lab server that contain the user information
        SC.Request.postUrl('/rest/userinfo/' + userName)
                .header({
            'Cookie': authCookie.name
        })
                .json()
                .notify(this, this.didCreatedUsers)
                .send(userAccount);
    },

    /* Upon receiving the response from the lab server, this function will :
     * 1. show a windows message that consist ('This user name has been created .')
     * 2. Initialize all the parameters by invoking clearFields
     * 3. Destroy all the record that may remain in the fixtures by invoking destroyRecords
     */
    didCreatedUsers: function(response) {
        var authCookie = SC.Cookie.find('SESS');
        // get the record from the admin_expList fixture
        var query = SC.Query.local(App.Admin_expList);
        var exp = App.store.find(query);
        var len=exp.getEach('isDone').length;
        var expList=[];
        var isDone=exp.getEach('isDone');
        var userName = this.get('userName');
        if (SC.ok(response)) {
            try{
                // loop through the fixtures and see which exp is been selected
                // if the exp been selected then add it to the expList
                for (var i =0 ; i < len; i++) {
                    if (isDone[i] === true)
                        expList.insertAt(expList.length, exp.getEach('expID')[i]);
                }
                console.log("Testing empty exp "+expList.length);
                if(expList.length >= 1)
                {

                    // send a POST request to the lab server that contain all the experiments
                    // that have been selected.
                    var userList=[{
                        expList:expList
                    }];
                    SC.Request.postUrl('/rest/explist/' + userName)
                            .header({
                        'Cookie': authCookie.name
                    })
                            .json()
                            .notify(this, this.didAssociateUser)
                            .send(userList);
                }
                else
                {
                  this.cancel();
                }
            }
            catch (err) {
                // Set an error message to the user
                alert( err.message);
            }

        }
    },

    didAssociateUser:function(response)
    {
        if (SC.ok(response)) {
            var data = response.get('body');
            var result = data.getEach('explistresult')[0];
            if (result === 'success') {
                alert('This user has been created');
                this.cancel();
/*
                App.getPath('accountPage.mainPane').remove();
                App.getPath('expListPage.mainPane').remove();
                this.clearFields();
                this.destroyRecords();
*/
            } else
                this.set('errorMessage', 'user name already exist .. Please try another user name ');
        }
    },

    /* When the cancel Button triggered, this function will do :
     * 1. invoke the clearField() function.
     * 2. it will remove both the account and the expList panel
     * 3. it will invoke the destroyRecords function that will clear the records.
     */
    cancel: function() {
        App.getPath('accountPage.mainPane').remove();
        App.getPath('expListPage.mainPane').remove();
        this.clearFields();
        this.destroyRecords();
    },

    adminTabShow: function() {
        App.mainPage.mainPane.tabView.set('items', [{
            title: 'Profile',
            value: 'App.profilePage.profileView'
        }, {
            title: 'Rigs',
            value: 'App.rigsPage.rigsView'
        }, {
            title: 'Experiments',
            value: 'App.expPage.expView'
        }, {
            title: 'Previous Data',
            value: 'App.prevExpPage.prevExpView'
        },  {
            title: 'Admin Tool',
            value: 'App.adminToolsPage.adminToolsView'
        }, {
            title: 'Contact Us',
            value: 'contactUs'
        }]);
    },

    adminTabHide: function() {
        App.mainPage.mainPane.tabView.set('items', [{
            title: 'Profile',
            value: 'App.profilePage.profileView'
        }, {
            title: 'Rigs',
            value: 'App.rigsPage.rigsView'
        }, {
            title: 'Experiments',
            value: 'App.expPage.expView'
        }, {
            title: 'Previous Data',
            value: 'App.prevExpPage.prevExpView'
        }, {
            title: 'Contact Us',
            value: 'contactUs'
        }]);
    }
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');