// ==========================================================================
// Project:   App.loginController
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

        (Document Your Controller Here)

 @extends SC.ObjectController
 */

// Requiring sha1 library
require('lib/sha1');

App.loginController = SC.ObjectController.create(
    /** @scope App.loginController.prototype */ {
   
    loginName:'',
    loginPassword: '',
    loginErrorMsg: '',

    panelOpened: false,
    isLoggingIn: NO,



    // Function from sha1 library used to hash password before sending
    hashPassword: function(password) {
        return password ? App.Sha1.sha1Hash(password) : '';
    },

    openPanel: function() {
        var panel;

        // Check to see if the panel is already open
        // If panel is already open do not open another
        if (this.get('panelOpened'))
            return NO;

        // Otherwise continue and set the flag to true
        this.set('panelOpened', true);

        // Erase all error messages from previous login
        this.set('loginErrorMsg', '');

        // Create a panel, display and shift focus to it
        panel = App.getPath('loginPage.panel');

        if (panel) {
            panel.append();
            panel.focus();
        }

        return YES;
    },

    closePanel: function() {
        var panel = App.getPath('loginPage.panel');
        if (panel) {
            panel.remove();
        }

        // Set panel opened flag to false
        this.set('panelOpened', false);
    },

    loginInformationHasChanged: function() {
        this.set('loginErrorMsg', '');
    }.observes('loginName', 'loginPassword'),

    // Function used to login to RestLabs
    login: function() {
        try {
            var loginMessage = '';
            var loginName = this.get('loginName');
            var loginPassword = this.get('loginPassword');

            // Checks to see if login name and password fields are not null or blank
            // If neither then prepare to send login request to server
            if ((loginName === null) || (loginName === ''))
                throw SC.Error.desc('Login name field cannot be empty');

            if ((loginPassword === null) || (loginPassword === ''))
                throw SC.Error.desc('Password field cannot be empty');

            // This flag is used to lock the input fields from being modified whilst
            // login process is underway
            this.set('isLoggingIn', YES);

            // Submit login details to the server if no observable problems are found
            loginMessage = loginName + '?' + this.hashPassword(loginPassword);

            SC.Request.getUrl('/rest/login/' + loginMessage)
                    .notify(this, this.didLogin)
                    .send();
        }

            // Catch any errors thrown, set the corresponding property so message can be
            // displayed and prevent web app from continuing login procedure
        catch (err) {
            this.set('loginErrorMsg', err.message);
            this.set('isLoggingIn', NO);
        }
    },

    // Callback function which will run when a login response has been received
    didLogin: function(response) {
        try {
            // Line below will be deleted when the server is  completed????
            var loginName = this.get('loginName');
            var data, authCookie, usercredential;

            // Unlock the login view and allow user input again
            this.set('isLoggingIn', NO);

            if (SC.ok(response)) {
                data = response.get('body');
                authCookie = SC.Cookie.create();
                usercredential = SC.Cookie.create();

                if (data !== 'error') {
                    //create a cookies for the userCredential and the user authentication as well
                    usercredential.name = 'userCredential';
                    usercredential.value = loginName;
                    usercredential.expires = null;
                    usercredential.write();

                    authCookie.name = 'SESS';
                    authCookie.value = data;
                    authCookie.path = '/';
                    authCookie.expires = null;
                    authCookie.write();

                    // clear data
                    this.set('errorMessage', '');

                    // call the checkUsers() function.
                    this.checkUsersRole(loginName);

                    this.closePanel();
                } else
                    throw SC.Error.desc('Incorrect username or password');
            } else
                throw SC.Error.desc('Incorrect username or password');
        }

        catch (error) {
            this.set('loginErrorMsg', error.message);
        }
    },
    /* This function is to do the following task:
     * 1. Call the show ListContainer function that will show the experiment on the experiment tab
     * 2.Check weather is the user is admin or not.
     *    a. If the user role  is admin then show the admin tab and show the admin profile as well
     *    b. If the user role is not an admin then show the user profile only.
     */
    checkUsersRole:function(user) {
        console.log("Checking the value of the coockies" + user);
        this.set('loginName', user);
        console.log("UserName is "+ this.get('loginName'));
        App.expListController.showListContainer(); // This will actually do the /rest/explist request as well
        if (user === 'admin') { // Needs to be changed in the future!!!!
            App.adminController.adminTabShow();
            //App.adminController.showAdminContainer();
            App.profileController.showUserProfileContainer();
        } else {
            App.profileController.showUserProfileContainer();  // This will actually do the /rest/userinfo request as well
            App.profileController.set('nowShowing', 'userProfileContainer');
        }
    }
});; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');