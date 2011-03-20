// ==========================================================================
// Project:   App - mainPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/* globals App */

// This page describes the main user interface for your application

App.mainPage = SC.Page.design({

    pageName: 'mainApp.mainPage',
    mainPane: SC.MainPane.design({
        childViews: 'topView tabView'.w(),

        topView: SC.ToolbarView.design({
            layout: {top: 0, left: 0, right: 0, height: 36},
            anchorLocation: SC.ANCHOR_TOP,
            childViews: 'titleLabel userLabel logoutButton'.w(),
            classNames: ['toolbar'],

            titleLabel: SC.View.design({
                layout: {
                    centerY: -3,
                    left:    12,
                    width:  112,
                    height:  30
                },
                classNames: ['rest-logo-small']
            }),

            userLabel: SC.LabelView.design({
                layout: {
                    centerY: 2,
                    right: 150,
                    height: 24,
                    width: 100
                },
                valueBinding: SC.Binding.oneWay('App.loginController.loginName'),
                textAlign: SC.ALIGN_RIGHT,
                fontWeight: SC.BOLD_WEIGHT
            }),

            logoutButton: SC.ButtonView.design({
                layout: {
                    centerY:  0,
                    height:  24,
                    right:   12,
                    width:  100
                },
                title: '_Logout'.loc(),
                icon:'sc-icon-user-16',
                target: 'App.logoutController',
                action: 'logOutMethod'
            })
        }),

        tabView: SC.TabView.design({
            items: [{
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
            }],
            itemTitleKey: 'title',
            itemValueKey: 'value',
            layout: {
                top:    24,
                left:   -4,
                right:  -4,
                bottom: -4
            },
            userDefaultKey: 'mainPane'
        })
    }),

    contactUs: SC.LabelView.design({
        escapeHTML: NO,
        classNames: 'welcome-tab',
        value: '<p><b>Project Supervisor:</b></p>' +
                '<p>John Zornig - j.zornig@uq.edu.au</p>' +
                '<p><b> Developers:</b></p>' +
                '<p>Steven Chen - steven.chen1@uqconnect.edu.au</p>' +
                '<p>Omar Alkylaney - omar.moonshine@gmail.com</p>',

        layout: {
            top: 20,
            left: 20
        }
    })

});
