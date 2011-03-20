// ==========================================================================
// Project:   App - prevExpPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/* globals App */

// This page describes the previous experiment list and data UI

App.prevExpPage = SC.Page.create({

    prevExpView: SC.View.design({
        classNames: ['container-tab'],
        childViews: [
            SC.ContainerView.design({
                nowShowingBinding: 'App.prevExpController.nowShowing',
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
    dataListContainer: SC.View.design({
        childViews: [
            SC.TableView.design({
                layout: { left: 15, right: 120, top: 15, bottom: 15 },
                backgroundColor: "#999EBA",
                columns: [
                    SC.TableColumn.create({
                        key:   'time',
                        label: 'Time',
                        width: 300
                    }),
                    SC.TableColumn.create({
                        key:   'dataType',
                        label: 'Type',
                        width: 100
                    }),
                    SC.TableColumn.create({
                        key:   'dataVal',
                        label: 'Voltage',
                        width: 300
                    })
                ],

                contentBinding:   'App.prevExpController.dataContent',
                selectionBinding: 'App.prevExpController.selection',
                // sortedColumnBinding: 'TableExample.usersController.sortedColumn',
                // selectOnMouseDown: YES,
                exampleView: SC.TableRowView,
                recordType: App.Expdata
            }),
            SC.ButtonView.design({
                layout: {
                    right:  15,
                    height: 40,
                    bottom:  5,
                    width: 100
                },
                title: "Back",
                icon: "sc-icon-options-16",
                target: "App.prevExpController",
                action: "backToExpView"
            })
        ]
    }),
    
    // Container for displaying list of available experiments
    // and list of previously completed experiments
    prevExpContainer: SC.View.design({
        layout: {
            left:   0,
            top:    0,
            right:  0,
            bottom: 0
        },

        childViews: [
            /*   SC.ScrollView.design({
             hasHorizontalScroller: NO,
             layout: {
             left:     0,
             top:      0,
             right:  120,
             height: 130
             },
             backgroundColor: 'white',
             contentView: SC.ListView.design({
             contentBinding: 'App.demoController.arrangedObjects',
             selectionBinding: 'App.demoController.selection',
             contentValueKey: "expName",
             rowHeight: 21
             })
             }), */

            /*    SC.LabelView.design({
             layout: {
             top:    140,
             left:    10,
             width:  600,
             height : 21
             },
             value: 'Previously completed experiments:',
             color:'black'
             }), */

            // Scroll view for previously completed experiment list
            SC.ScrollView.design({
                hasHorizontalScroller: NO,
                layout: {
                    left:     0,
                    top:      0,
                    right:  130,
                    bottom:   0
                },
                backgroundColor: 'white',
                contentView: SC.ListView.design({
                    contentBinding: 'App.prevExpController.arrangedObjects',
                    selectionBinding: 'App.prevExpController.selection',
                    contentValueKey: "expDesc",
                    rowHeight: 21
                })
            }),

            /*    SC.ButtonView.design({
             layout: {
             right:  15,
             height: 40,
             top:   104,
             width: 100
             },
             title: "Connect",
             icon:"sc-icon-options-16",
             target: "App.demoController",
             action: "showSchemaPanel"
             }), */

            SC.ButtonView.design({
                layout: {
                    right:  15,
                    height: 40,
                    bottom:  5,
                    width: 100
                },
                title: "View Data",
                icon:"sc-icon-options-16",
                target: "App.prevExpController",
                action: "getExpData"
            })

            /*    SC.ButtonView.design({
             layout: {
             top:     5,
             centerY: 0,
             height: 30,
             right:  18,
             width:  90
             },
             titleMinWidth: 0,
             title: "Logout".loc(),
             icon:"sc-icon-user-16",
             target:"App.taskController",
             action:"logOutMethod"
             }) */
        ]
    })

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');