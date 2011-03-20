// ==========================================================================
// Project:   App - accountPage
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/* globals App */

App.accountPage = SC.Page.design({
// The main signup pane.  used to show info
  mainPane: SC.PanelPane.design({
    layout: { centerX: 0, width: 440, centerY: 0, height: 350 },

    //defaultResponder: App,
    contentView: SC.View.design({

      childViews: "prompt nextButton cancelButton user userLabel passLabel password confirmPassLabel confirmPass nameLabel firstName lastName courseLabel course uniLabel uni typeLabel type errLabel".w(),

      // PROMPT
      prompt: SC.LabelView.design({
        layout: { top: 12, left: 20, height: 18, right: 20 },
        value: "_Complete the information below to create an account".loc()
      }),

      // INPUTS
      
      userLabel: SC.LabelView.design({
        layout: { top: 40, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Username:".loc()
      }),

      user: SC.TextFieldView.design({
        layout: { top: 40, left: 100,  height: 20, width: 270},
        valueBinding: "App.adminController.userName"
      }),
      
      
      passLabel: SC.LabelView.design({
        layout: { top: 68, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Password:".loc()
      }),

      password: SC.TextFieldView.design({
        layout: { top: 68, left: 100,  height: 20, width: 270},
        isPassword: YES, 
        valueBinding: "App.adminController.password"
      }),

      confirmPassLabel: SC.LabelView.design({
        layout: { top: 100, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Confirm:".loc()
      }),
 
      confirmPass: SC.TextFieldView.design({
        layout: { top: 100, left: 100,  height: 20, width: 270},
        isPassword: YES,   
        valueBinding: "App.adminController.confPass"
      }),

      nameLabel: SC.LabelView.design({
        layout: { top: 128, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Name:".loc()
      }),

      firstName: SC.TextFieldView.design({
        layout: { top: 128, left: 100, height: 20, width: 130 },
        valueBinding: "App.adminController.firstName"
      }),

      lastName: SC.TextFieldView.design({
        layout: { top: 128, left: 240, height: 20, width: 130 },
        valueBinding: "App.adminController.lastName"
      }),

      courseLabel: SC.LabelView.design({
        layout: { top: 158, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Course:".loc()
      }),

      course: SC.TextFieldView.design({
        layout: { top: 158, left: 100, height: 20, width: 270 },
        valueBinding: "App.adminController.course"
      }),

      uniLabel: SC.LabelView.design({
        layout: { top: 188, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Uni:".loc()
      }),

      uni: SC.TextFieldView.design({
        layout: { top: 188, left: 100,  height: 20, width: 270},
        valueBinding: "App.adminController.uni"
      }),
       
      typeLabel: SC.LabelView.design({
        layout: { top: 220, left: 20, width: 70, height: 18 },
        textAlign: SC.ALIGN_RIGHT,
        value: "_Type:".loc()
      }),

      type: SC.RadioView.design({
        layout: { top: 220, left: 100, right: 20, height: 40 },
        items: "User Admin".w(),
        valueBinding: "App.adminController.type" 
      }),
      
      
      errLabel: SC.LabelView.design({
        layout: { top: 260, left: 20, width: 300, height: 18 },
        textAlign: SC.ALIGN_LEFT,
        valueBinding: "App.adminController.errorMessage"
      }),

      // BUTTONS
      nextButton: SC.ButtonView.design({
        layout: { bottom: 20, right: 20, width: 90, height: 24 },
        title: "_Next".loc(),
        isDefault: YES,
        target:'App.adminController',
        action: "next"
      }),

      cancelButton: SC.ButtonView.design({
        layout: { bottom: 20, right: 120, width: 90, height: 24 },
        title: "_Cancel".loc(),
        isCancel: YES,
        target:'App.adminController',  
        action: "cancel"
      })
    })
  })

})
