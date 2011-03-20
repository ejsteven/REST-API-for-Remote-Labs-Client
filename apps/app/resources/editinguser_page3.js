// ==========================================================================
// Project:   App - editingUserPage3
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.editingUserPage3 = SC.Page.design({
// The main experiment_list page
    mainPane: SC.PanelPane.design({
        layout: { centerX: 0, width: 440, centerY: 0, height: 350 },

        //defaultResponder: App,
        contentView: SC.View.design({
            childViews: "prompt middleView submitButton cancelButton ".w(),

            // PROMPT
            prompt: SC.LabelView.design({
                layout: { top: 12, left: 20, height: 18, right: 20 },
                value: "Assign Experiments".loc()
            }),

            //The list view for the experiments
            middleView: SC.ScrollView.design({
                hasHorizontalScroller: NO,
                layout: {top: 40,bottom:50,left: 20,right: 20},
                backgroundColor: 'white',
                contentView: SC.ListView.design({
                    contentBinding: 'App.edituserController.expListData',
                    selectionBinding: 'App.edituserController.selection',
                    contentValueKey: "expName",
                    contentCheckboxKey: "isDone",
                    rowHeight: 21,
                    target: "App.edituserController",
                    action: "toggleDone"
                })
            }),

            //Buttons
            submitButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 20, width: 90, height: 24 },
                title: "Submit".loc(),
                isDefault: YES,
                target:'App.edituserController',
                action: "submit"
            }),

            cancelButton: SC.ButtonView.design({
                layout: { bottom: 20, right: 120, width: 90, height: 24 },
                title: "Cancel".loc(),
                isCancel: YES,
                target:'App.edituserController',
                action: "cancel"
            })
        })
    })
});