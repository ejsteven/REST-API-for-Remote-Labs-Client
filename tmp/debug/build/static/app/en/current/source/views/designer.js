// ==========================================================================
// Project:   App.DesignerView
// Copyright: ©2011 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

View for the application designer canvas which will allow users to drag and
drop experiment widgets to create a custom interface for an experiment.

  @extends SC.View
*/

App.DesignerView = SC.View.extend(
/** @scope App.DesignerView.prototype */ {

    childViews: 'widgetsButton propertiesButton saveButton cancelButton'.w(),

    widgetsButton: SC.ButtonView.design({
        title: 'Show Widgets',
        action: 'showHideWidgetsPane',
        target: 'App.designerController',
        layout: {
            centerX: -195,
            top:       10,
            height:    60,
            width:    120
        }
    }),

    propertiesButton: SC.ButtonView.design({
        title: 'Show Properties',
        action: 'showHidePropertiesPane',
        target: 'App.designerController',
        layout: {
            centerX: -65,
            top:      10,
            height:   60,
            width:   120
        }
    }),

    saveButton: SC.ButtonView.design({
        title: 'Save',
        action: 'saveCustomView',
        target: 'App.designerController',
        layout: {
            centerX: 65,
            top:     10,
            height:  60,
            width:  120
        }
    }),

    cancelButton: SC.ButtonView.design({
        title: 'Cancel',
        action: 'cancelDesigner',
        target: 'App.designerController',
        layout: {
            centerX: 195,
            top:      10,
            height:   60,
            width:   120
        }
    })

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');