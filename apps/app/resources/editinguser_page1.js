// ==========================================================================
// Project:   App - editingUserPage1
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.editingUserPage1 = SC.Page.design({

    mainPane: SC.PanelPane.design({
        layout: { centerX: 0, width: 440, centerY: 0, height: 350 },

        //defaultResponder: App,
        contentView: SC.View.design({
            childViews: "prompt nextButton cancelButton middleView errLabel".w(),

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
                    contentBinding: 'App.edituserController.arrangedObjects',
                    selectionBinding: 'App.edituserController.selection',
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
                valueBinding: "App.edituserController.errorMessage"
            }),

            // BUTTONS
            nextButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 20, width: 90, height: 24 },
                title: "Next".loc(),
                isDefault: YES,
                target:"App.edituserController",
                action: "nextToEditUserPage2"
            }),

            cancelButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 120, width: 90, height: 24 },
                title: "Cancel".loc(),
                isCancel: YES,
                target:"App.edituserController",
                action: "cancel"
            })
        })
    })

});
