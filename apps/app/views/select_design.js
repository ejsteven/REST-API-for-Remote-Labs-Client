// ==========================================================================
// Project:   App.SelectDesignView
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

App.SelectDesignView = SC.View.extend(
/** @scope App.SelectDesignView.prototype */ {

    childViews: 'scrollView buttonView cancelButton'.w(),

    scrollView: SC.ScrollView.design({
        layout: {
            left:     0,
            top:      0,
            right:  120,
            bottom:   0
        },
        contentView: SC.ListView.design({
            contentBinding: 'App.expListController.arrangedObjects',
            selectionBinding: 'App.expListController.selection',
            contentValueKey: 'expName',
            rowHeight: 21
        }),
        hasHorizontalScroller: NO,
        backgroundColor: 'white'
    }),

    buttonView: SC.ButtonView.design({
        layout: {
            right:  15,
            height: 40,
            bottom:  55,
            width: 100
        },
        title: 'Confirm',
        icon: 'sc-icon-options-16',
        target: 'App.designerController',
        action: 'confirmExperiment'
    }),
    cancelButton: SC.ButtonView.design({
        layout: {
            right:  15,
            height: 40,
            bottom:  5,
            width: 100
        },
        title: 'Cancel',
        icon: 'sc-icon-options-16',
        target: 'App.designerController',
        action: 'CancelExperiment'
    })

});
