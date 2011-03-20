// ==========================================================================
// Project:   App - expPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

App.expPage = SC.Page.create({

    expView: SC.View.design({
        classNames: ['container-tab'],
        childViews: 'switchView'.w(),

        switchView: SC.ContainerView.design({
            nowShowingBinding: 'App.expSelectController.nowShowing',
            layout: {
                left:   10,
                top:    20,
                bottom: 10,
                right:  10
            }
        })
    }),

    // Container for displaying list of available experiments
    // and list of previously completed experiments
    selectContainer: SC.View.design({
        layout: {
            left:   0,
            top:    0,
            right:  0,
            bottom: 0
        },
        childViews: 'scrollView'.w(),
        scrollView: SC.ScrollView.design({
            hasHorizontalScroller: NO,
            layout: {
                left:   0,
                top:    0,
                right:  0,
                bottom: 0
            },
            backgroundColor: '#fff',
            contentView: SC.GridView.design({
                layout: {
                    left:   10,
                    top:    10,
                    right:  10,
                    bottom: 10
                },
                rowHeight: 180,
                columnWidth: 180,
                contentBinding: 'App.expListController.arrangedObjects',
                selectionBinding: 'App.expListController.selection',
                contentValueKey: 'expName',
                classNames: ['exp'],
                exampleView: App.ExpView,
                target: 'App.expListController',
                action: 'obtainExpID',
                actOnSelect: YES
            })
        })
    }),

    //Creating the first experiment View
    expContainer: SC.View.design({
        childViews: 'startButton resumeButton pauseButton stopButton'.w(),

        layout: {
            top:    0,
            right:  0,
            bottom: 0,
            left:   0
        },

        startButton: SC.ButtonView.design({
            layout: {
                centerX: -195,
                top:       10,
                height:    60,
                width:    120
            },
            isEnabledBinding: SC.Binding.oneWay('App.expController.flagStart').bool(),
            title: 'Start',
            action: 'startExp',
            target: 'App.expController'
        }),

        resumeButton: SC.ButtonView.design({
            layout: {
                centerX: -65,
                top:      10,
                height:   60,
                width:   120
            },
            isEnabledBinding: SC.Binding.oneWay('App.expController.flagResume').bool(),
            title: 'Resume',
            action: 'resumeExp',
            target: 'App.expController'
        }),

        pauseButton: SC.ButtonView.design({
            layout: {
                centerX: 65,
                top:     10,
                height:  60,
                width:  120
            },
            isEnabledBinding: SC.Binding.oneWay('App.expController.flagPause').bool(),
            title: 'Pause',
            action: 'pauseExp',
            target: 'App.expController'
        }),

        stopButton: SC.ButtonView.design({
            layout: {
                centerX: 195,
                top:      10,
                height:   60,
                width:   120
            },
            isEnabledBinding: SC.Binding.oneWay('App.expController.flagStop').bool(),
            title: 'Stop',
            action: 'stopExp',
            target: 'App.expController'
        })
    })

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');