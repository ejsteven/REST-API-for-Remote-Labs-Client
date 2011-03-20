// ==========================================================================
// Project:   App - adminToolsPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/* globals App */

// This page decribes the administration tools page

App.adminToolsPage = SC.Page.create({
  adminToolsView: SC.View.design({
    classNames: ['container-tab'],
    childViews: [
      SC.ContainerView.design({
        nowShowingBinding: 'App.adminController.nowShowing',
        layout: {
          left:   10,
          top:    20,
          bottom: 10,
          right:  10
        }
      })
    ]
  }),

  adminContainer: App.AdminView.design(),
  selectContainer: App.SelectDesignView.design(),
  designerContainer: App.DesignerView.design()
});
