// ==========================================================================
// Project:   App - profilePage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/* globals App */

// This page describes the UI which display information on the user e.g.
// name, university, course etc.

App.profilePage = SC.Page.create({
    profileView: SC.View.design({
        classNames: ['container-tab'],
        childViews: 'contentView'.w(),

        contentView: SC.ContainerView.design({
            nowShowingBinding: 'App.profileController.nowShowing',
            layout: {
                left:   10,
                top:    20,
                bottom: 10,
                right:  10
            }
        })
    }),

    userProfileContainer: SC.View.design({
        layout: {
            top:    0,
            bottom: 0,
            left:   0,
            right:  0
        },

        childViews: 'contentView'.w(),

        contentView: SC.View.design({
            classNames: ['rounded-corners'],
            layout: {
                width:   450,
                bottom:   10,
                centerX:   0,
                top:      10
            },
            backgroundColor: '#254981',
            childViews: 'titleView nameLabel firstNameField lastNameField uniLabel uniField courseLabel courseField updateButton'.w(),

            titleView: SC.LabelView.design({
                layout: {
                    top:    12,
                    height: 25,
                    left:    0,
                    right:   0
                },
                backgroundColor: '#2c3a57',
                fontWeight: SC.BOLD_WEIGHT,
                controlSize: SC.LARGE_CONTROL_SIZE,
                textAlign: SC.ALIGN_CENTER,
                valueBinding: 'App.profileController.profileTitle'
            }),

            nameLabel: SC.LabelView.design({
                layout: {
                    top:    60,
                    height: 20,
                    left:   20,
                    width: 100
                },
                fontWeight: SC.BOLD_WEIGHT,
                value: 'Name:'
            }),

            firstNameField: SC.TextFieldView.design({
                layout: {
                    top:     60,
                    height:  20,
                    left:   115,
                    width:  148
                },
                fontWeight: SC.BOLD_WEIGHT,
                valueBinding: 'App.profileController.firstName'
            }),

            lastNameField: SC.TextFieldView.design({
                layout: {
                    top:     60,
                    height:  20,
                    left:   272,
                    width:  148
                },
                fontWeight: SC.BOLD_WEIGHT,
                valueBinding: 'App.profileController.lastName'
            }),

            uniLabel: SC.LabelView.design({
                layout: {
                    top:    90,
                    height: 20,
                    left:   20,
                    width: 100
                },
                fontWeight: SC.BOLD_WEIGHT,
                value: 'University:'
            }),

            uniField: SC.TextFieldView.design({
                layout: {
                    top:     90,
                    height:  20,
                    left:   115,
                    width:  305
                },
                fontWeight: SC.BOLD_WEIGHT,
                valueBinding: 'App.profileController.uni'
            }),

            courseLabel: SC.LabelView.design({
                layout: {
                    top:    120,
                    height:  20,
                    left:    20,
                    width:  100
                },
                fontWeight: SC.BOLD_WEIGHT,
                value: 'Course:'
            }),

            courseField: SC.TextFieldView.design({
                layout: {
                    top:    120,
                    height:  20,
                    left:   115,
                    width:  305
                },
                fontWeight: SC.BOLD_WEIGHT,
                valueBinding:'App.profileController.course'
            }),

            updateButton: SC.ButtonView.design({
                layout: {
                    top:    165,
                    height:  30,
                    left:   330,
                    width:   90
                },
                titleMinWidth: 0,
                isDefault: YES,
                title: 'Update'.loc(),
                target:'App.profileController',
                action:'updateProfile'
            })
        })
    }),

    /* This view will create an admin container that will consist the following childs views :
     * the user name label
     * A list view of the user information
     * A list view for the admin profile
     * bottoms for deleting, adding and editing some users.
     */
    adminContainer: SC.View.design({
        layout: {
            left:   0,
            top:    0,
            right:  0,
            bottom: 0
        },
        childViews: [
            SC.View.design({
                layout: { width: 450, bottom:5, left:5,top:5},
                backgroundColor : '#254981',
                childViews: [
                    SC.LabelView.design({
                        layout: {top: 10, height: 20, left: 20, right: 20 },
                        fontWeight: SC.BOLD_WEIGHT,
                        valueBinding: 'App.welcomeController.displayMessage',
                        escapeHTML: NO
                    }),
                    SC.LabelView.design({
                        layout: {top: 60, height: 20, left: 20, width: 100},
                        fontWeight: SC.BOLD_WEIGHT,
                        value:"Name: "
                    }),
                    SC.TextFieldView.design({
                        layout: {top: 60, height: 20,left: 115, width: 148},
                        fontWeight: SC.BOLD_WEIGHT,
                        valueBinding:"App.welcomeController.firstName"
                    }),
                    SC.TextFieldView.design({
                        layout: {top: 60, height: 20, left: 272, width: 148},
                        fontWeight: SC.BOLD_WEIGHT,
                        valueBinding:"App.welcomeController.lastName"
                    }),

                    SC.LabelView.design({
                        layout: {top: 90, height: 20, left: 20, width: 100},
                        fontWeight: SC.BOLD_WEIGHT,
                        value:"University: "
                    }),
                    SC.TextFieldView.design({
                        layout: {top: 90, height: 20, left: 115, width: 305},
                        fontWeight: SC.BOLD_WEIGHT,
                        valueBinding:"App.welcomeController.uni"
                    }),
                    SC.LabelView.design({
                        layout: {top: 120, height: 20, left: 20, width: 100},
                        fontWeight: SC.BOLD_WEIGHT,
                        value:"Course: "
                    }),
                    SC.TextFieldView.design({
                        layout: {top: 120, height: 20, left: 115, width: 305},
                        fontWeight: SC.BOLD_WEIGHT,
                        valueBinding:"App.welcomeController.course"
                    }),
                    SC.ButtonView.design({
                        layout: {top: 165, height: 30, left: 330, width: 90},
                        titleMinWidth: 0,
                        isDefault: YES,
                        title: "Update".loc(),
                        target:"App.welcomeController",
                        action:"updateProfile"
                    }),
                ]
            }),

            SC.View.design({
                layout: {width:450, bottom:5,left:600,top:5},
                childViews: [
                    SC.ButtonView.design({
                        layout: {top:5,centerY: 0,height: 30,left: 90, right:15,width:100},
                        titleMinWidth: 0,
                        title: "Add".loc(),
                        icon:"sc-icon-user-16",
                        target:"App.adminController",
                        action:"createAccount"
                    }),
                    SC.ButtonView.design({
                        layout: {top:5,centerY: 0,height: 30,left: 205, right:15,width:100},
                        titleMinWidth: 0,
                        title: "Edit".loc(),
                        icon:"sc-icon-user-16",
                        target:"App.edituserController",
                        action:"edit"
                    }),
                    SC.ButtonView.design({
                        layout: {top:5,centerY: 0,height: 30,left: 315, right:15,width:100},
                        titleMinWidth: 0,
                        title: "Delete".loc(),
                        icon:"sc-icon-user-16",
                        target:"App.adminController",
                        action:""
                    }),
                ]
            }),

            SC.ButtonView.design({
                layout: {top:10,centerY: 0,height: 30,right:15,width:90},
                titleMinWidth: 0,
                title: "Logout".loc(),
                icon:"sc-icon-user-16",
                target:"App.taskController",
                action:"logOutMethod"
            })
        ]
    })
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');