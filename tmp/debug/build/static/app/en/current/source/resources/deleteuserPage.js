// ==========================================================================
// Project:   App - editingUserPage1
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.deleteUserPage = SC.Page.design({

    mainPane: SC.PanelPane.design({
        layout: { centerX: 0, width: 440, centerY: 0, height: 350 },

        //defaultResponder: App,
        contentView: SC.View.design({
            childViews: "prompt confirmButton cancelButton middleView errLabel".w(),

            // PROMPT
            prompt: SC.LabelView.design({
                layout: { top: 12, left: 20, height: 18, right: 20 },
                value: "Please select a user that you want to add his/her information".loc()
            }),

            //The list view for the userName
            middleView: SC.ScrollView.design({
                hasHorizontalScroller: NO,
                layout: {top: 40,bottom:80,left: 20,right: 20},
                backgroundColor: 'white',
                contentView: SC.ListView.design({
                    contentBinding: 'App.deleteUserController.arrangedObjects',
                    selectionBinding: 'App.deleteUserController.selection',
                    contentValueKey: "user",
                    //contentCheckboxKey: "isDone",
                    rowHeight: 21
                    //target: "App.adminController",
                    //action: "toggleDone"
                })
            }),

            errLabel: SC.LabelView.design({
                layout: { bottom:50, left: 20, width: 300, height: 18 },
                textAlign: SC.ALIGN_LEFT,
                valueBinding: "App.deleteUserController.errorMessage"
            }),

            // BUTTONS
            confirmButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 20, width: 90, height: 24 },
                title: "Confirm".loc(),
                isDefault: YES,
                target:"App.deleteUserController",
                action: "confirm"
            }),

            cancelButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 120, width: 90, height: 24 },
                title: "Cancel".loc(),
                isCancel: YES,
                target:"App.deleteUserController",
                action: "cancel"
            })
        })
    })

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');