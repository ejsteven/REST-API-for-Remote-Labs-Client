// ==========================================================================
// Project:   App - schemaPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.schemaPage = SC.Page.design({
    // The main temp page
    mainPane: SC.PanelPane.design({
        layout: {centerX: 0, width: 440, centerY: 0, height: 350},

        contentView: SC.View.design({
            childViews: 'prompt middleView submitButton cancelButton'.w(),

            // PROMPT
            prompt: SC.LabelView.design({
                layout: {top: 12, left: 20, height: 18, right: 20},
                value: 'Assign Schema'.loc()
            }),

            //The list view for the templates
            middleView: SC.ScrollView.design({
                hasHorizontalScroller: NO,
                layout: {top: 40,bottom:50,left: 20,right: 20},
                backgroundColor: 'white',
                contentView: SC.ListView.design({
                    contentBinding: 'App.schemaController.arrangedObjects',
                    selectionBinding: 'App.schemaController.selection',
                    contentValueKey: 'schemaName',
                    rowHeight: 21
                })
            }),

            //Buttons
            submitButton: SC.ButtonView.design({
                layout: {bottom: 20, right: 20, width: 90, height: 24},
                title: 'Submit'.loc(),
                isDefault: YES,
                target:'App.expSelectController',
                action: 'getReserve'
            }),

            cancelButton: SC.ButtonView.design({
                layout: {bottom: 20, right: 120, width: 90, height: 24},
                title: 'Cancel'.loc(),
                isCancel: YES,
                target:'App.schemaController',
                action: 'cancel'
            })
        })
    })

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');