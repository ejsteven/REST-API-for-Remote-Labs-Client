// ==========================================================================
// Project:   App - rigsPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*global App */

App.rigsPage = SC.Page.create({
    rigsView: SC.View.design({
        classNames: ['container-tab'],
        childViews: [
            SC.ContainerView.design({
                nowShowing: 'rigsContainer',
                layout: {
                    left:   10,
                    top:    20,
                    bottom: 10,
                    right:  10
                }
            })
        ]
    }),

    rigsContainer: SC.ImageView.design({
        layout: {top: 20, centerX: 0, bottom: 80, height: 350, width: 400 },
        valueBinding: 'App.rigsPage.rigURL'
    }),

    rigURL: 'http://foyercam.itee.uq.edu.au/axis-cgi/mjpg/video.cgi'

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');