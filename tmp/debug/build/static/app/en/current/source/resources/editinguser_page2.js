// ==========================================================================
// Project:   App - editingUserPage2
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.editingUserPage2 = SC.Page.design({

    mainPane: SC.PanelPane.design({
        layout: { centerX: 0, width: 440, centerY: 0, height: 350 },
        contentView: SC.View.design({
            childViews: 'prompt nextButton cancelButton nameLabel firstName\
                        lastName courseLabel course uniLabel uni'.w(),

            // PROMPT
            prompt: SC.LabelView.design({
                layout: { top: 12, left: 20, height: 18, right: 20 },
                value: 'Please enter the user information'.loc()
            }),

            //Inputs
            nameLabel: SC.LabelView.design({
                layout: { top: 128, left: 20, width: 70, height: 18 },
                textAlign: SC.ALIGN_RIGHT,
                value: 'Name:'.loc()
            }),

            firstName: SC.TextFieldView.design({
                layout: { top: 128, left: 100, height: 20, width: 130 },
                valueBinding: 'App.edituserController.firstName'
            }),
            lastName: SC.TextFieldView.design({
                layout: { top: 128, left: 240, height: 20, width: 130 },
                valueBinding: 'App.edituserController.lastName'
            }),

            courseLabel: SC.LabelView.design({
                layout: { top: 158, left: 20, width: 70, height: 18 },
                textAlign: SC.ALIGN_RIGHT,
                value: 'Course:'.loc()
            }),
            course: SC.TextFieldView.design({
                layout: { top: 158, left: 100, height: 20, width: 270 },
                valueBinding: 'App.edituserController.course'
            }),

            uniLabel: SC.LabelView.design({
                layout: { top: 188, left: 20, width: 70, height: 18 },
                textAlign: SC.ALIGN_RIGHT,
                value: 'Uni:'.loc()
            }),
            uni: SC.TextFieldView.design({
                layout: { top: 188, left: 100,  height: 20, width: 270},
                valueBinding: 'App.edituserController.uni'
            }),

            // BUTTONS
            nextButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 20, width: 90, height: 24 },
                title: 'Next'.loc(),
                isDefault: YES,
                target:'App.edituserController',
                action: 'nextToEditUserPage3'
            }),

            cancelButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 120, width: 90, height: 24 },
                title: 'Cancel'.loc(),
                isCancel: YES,
                target:'App.edituserController',
                action: 'cancel'
            })
        })
    })
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');