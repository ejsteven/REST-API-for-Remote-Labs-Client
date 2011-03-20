// ==========================================================================
// Project:   App.WidgetsPanel
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.PalettePane
*/

App.WidgetsPanel = SC.PalettePane.extend(
/** @scope App.WidgetsPanel.prototype */ {
    
    layout: {
        width:  150,
        height: 270,
        right:  190,
        top:      0
    },

    contentView: SC.View.extend({
        layout: {top: 0, left: 0, bottom: 0, right: 0},
        childViews: 'labelView addSlider addGraph addProgress addSwitch addCam addMeter addDial'.w(),

        labelView: SC.LabelView.extend({
            layout: {top: 5, height: 25, left: 0, right: 0},
            textAlign: SC.ALIGN_CENTER,
            controlSize: SC.LARGE_CONTROL_SIZE,
            value: 'Widgets'
        }),

        addSlider: SC.ButtonView.extend({
            layout: {top: 40, height: 25, left: 5, right: 5},
            title: 'Slider',
            target: 'App.designerController',
            action: 'addSlider'
        }),

        addGraph: SC.ButtonView.extend({
            layout: {top: 70, height: 25, left: 5, right: 5},
            title: 'Graph',
            target: 'App.designerController',
            action: 'addGraph'
        }),

        addProgress: SC.ButtonView.extend({
            layout: {top: 100, height: 25, left: 5, right: 5},
            title: 'Progress Bar',
            target: 'App.designerController',
            action: 'addProgress'
        }),

        addSwitch: SC.ButtonView.extend({
            layout: {top: 130, height: 25, left: 5, right: 5},
            title: 'Two Way Switch',
            target: 'App.designerController',
            action: 'addSwitch'
        }),

        addCam: SC.ButtonView.extend({
            layout: {top: 160, height: 25, left: 5, right: 5},
            title: 'Video Camera Feed',
            target: 'App.designerController',
            action: 'addCam'
        }),

        addMeter: SC.ButtonView.extend({
            layout: {top: 190, height: 25, left: 5, right: 5},
            title: 'Meter',
            target: 'App.designerController',
            action: 'addMeter'
        }),

        addDial: SC.ButtonView.extend({
            layout: {top: 220, height: 25, left: 5, right: 5},
            title: 'Dial',
            target: 'App.designerController',
            action: 'addDial'
        })
    })
});
