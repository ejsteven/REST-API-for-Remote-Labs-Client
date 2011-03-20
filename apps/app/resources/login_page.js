// ==========================================================================
// Project:   App - loginPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.loginPage = SC.Page.create({

    panel: SC.PanelPane.create({
        layout: { top: 0, bottom: 0, left: 0, right: 0 },
        classNames: ['login-page'],
        backgroundColor: '#252525',

        contentView: SC.View.design({

            layout: { centerX: 0, centerY: 0, width: 500, height: 390 },
            classNames: ['login-body'],
            childViews: 'projectLogo projectDesc loginNameField passwordField loginErrorMessageLabel loginButton'.w(),

            projectLogo: SC.View.design({
                layout: { top: 0, left: 45, width: 450, height: 70 },
                classNames: ['rest-logo-large']
            }),

            projectDesc: SC.View.design({
                layout: { top: 85, left: 65, width: 450, height: 90 },
                classNames: ['rest-desc']
            }),
            /*
             guestSignupButton: document.title.match(/Dev|Demo|SproutCore|Greenhouse/)? SC.ButtonView.design({
             layout: { top: 20, right: 0, height: 23, width: 155 },
             classNames: ['dark'],
             icon: 'user-role-guest',
             title: "_GuestSignup".loc() + '...',
             target: 'Tasks',
             action: 'launchSignupPane'
             }) : SC.View.design({ layout: { top: 70, left: 520, height: 1, width: 1 } }), */

            loginNameField: SC.TextFieldView.design({
                layout: { top: 190, left: 50, right: 30, height: 32 },
                hint: '_LoginNameHint'.loc(),
                valueBinding: 'App.loginController.loginName',
                isEnabledBinding: SC.Binding.from("App.welcomeController.isLoggingIn")
                        .bool()
                        .transform(function(value, isForward) {
                    return !value;
                })
            }),

            passwordField: SC.TextFieldView.design({
                layout: { top: 240, left: 50, right: 30, height: 32 },
                isPassword: YES,
                hint: '_PasswordHint'.loc(),
                valueBinding: 'App.loginController.loginPassword',
                isEnabledBinding: SC.Binding.from("App.welcomeController.isLoggingIn")
                        .bool()
                        .transform(function(value, isForward) {
                    return !value;
                })
            }),

            loginErrorMessageLabel: SC.LabelView.design({
                layout: { top: 290, left: 50, right: 30, height: 20 },
                classNames: ['error-message'],
                textAlign: SC.ALIGN_CENTER,
                valueBinding: SC.Binding.oneWay('App.loginController.loginErrorMsg')
            }),

            loginButton: SC.ButtonView.design({
                layout: { bottom: 40, right: 30, width: 100, height: 24 },
                titleMinWidth: 0,
                isEnabledBinding: SC.Binding.oneWay('App.loginController.loginName').bool(),
                isDefault: YES,
                title: '_Login'.loc(),
                target: 'App.loginController',
                action: 'login'
            })

        }),

        focus: function() {
            this.contentView.loginNameField.becomeFirstResponder();
        }

    })

});
