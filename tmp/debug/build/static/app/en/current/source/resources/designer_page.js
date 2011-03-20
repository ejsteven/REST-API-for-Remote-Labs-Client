// ==========================================================================
// Project:   App - designerPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/* globals App */

// Layout containing a container view with swappable views for the experiment view designer

App.designerPage = SC.Page.create({
  // Create a container view for switching between different containers

    designerView: SC.View.design({
        classNames: ['container-tab'],
        childViews: [
            SC.ContainerView.design({
                nowShowingBinding: 'App.designerController.nowShowing',
                layout: {
                    left:   10,
                    top:    20,
                    bottom: 10,
                    right:  10
                }
            })
        ]
    }),

    // Container for displaying previous experiment data
    selectionContainer: SC.View.design({
        childViews: [
            SC.ScrollView.design({
                hasHorizontalScroller: NO,
                layout: {
                    left:     0,
                    top:      0,
                    right:  120,
                    bottom:   0
                },
                backgroundColor: 'white',
                contentView: SC.ListView.design({
                    contentBinding: 'App.expListController.arrangedObjects',
                    selectionBinding: 'App.expListController.selection',
                    contentValueKey: 'expName',
                    rowHeight: 21
                })
            }),

            SC.ButtonView.design({
                layout: {
                    right:  15,
                    height: 40,
                    bottom:  5,
                    width: 100
                },
                title: 'Confirm',
                icon: 'sc-icon-options-16',
                target: 'App.designerController',
                action: 'confirmExperiment'
            })
        ]
    }),

    creatorContainer: SC.View.design({
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
            layout: {
                centerX: 195,
                top:      10,
                height:   60,
                width:   120
            }
        })
    })

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');