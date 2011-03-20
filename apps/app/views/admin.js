// ==========================================================================
// Project:   App.AdminView
// Copyright: ©2011 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

View which contains buttons for allowing a user with admin privileges to add,
edit or remove the user (i.e. by opening up an user list modification panel)
as well as a button for opening up the experiment interface designer view.

  @extends SC.View
*/

App.AdminView = SC.View.extend(
/** @scope App.AdminView.prototype */ {

    childViews: 'addUser editUser deleteUser designUI'.w(),

    addUser: SC.ButtonView.design({
        title: 'Add User',
        action: 'createAccount',
        target: 'App.adminController',
        layout: {
            centerX: -195,
            top:       10,
            height:    60,
            width:    120
        }
    }),

    editUser: SC.ButtonView.design({
        title: 'Edit User',
        action: 'edit',
        target: 'App.edituserController',
        layout: {
            centerX: -65,
            top:      10,
            height:   60,
            width:   120
        }
    }),

    deleteUser: SC.ButtonView.design({
        title: 'Delete User',
        action: 'deleteUsers', // will be implemented later
        target: 'App.deleteUserController',
        layout: {
            centerX: 65,
            top:     10,
            height:  60,
            width:  120
        }
    }),

    designUI: SC.ButtonView.design({
        title: 'Design Exp UI',
        action: 'showDesignSelection',
        target: 'App.adminController',
        layout: {
            centerX: 195,
            top:      10,
            height:   60,
            width:   120
        }
    })

});
