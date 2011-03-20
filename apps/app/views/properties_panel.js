// ==========================================================================
// Project:   App.PropertiesPanel
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.PalettePane
*/

App.PropertiesPanel = SC.PalettePane.extend(
    /** @scope App.PropertiesPanel.prototype */ {
    layout: {
        width:  150,
        height: 365,
        right:   20,
        top:      0
    },

    contentView: SC.View.extend({
        layout: {
            top:    0,
            left:   0,
            bottom: 0,
            right:  0
        },
        childViews: 'labelView topLabel leftLabel heightLabel widthLabel topField leftField heightField widthField\
                     bindingLabel bindingSelField minimumLabel minimumField maximumLabel maximumField stepLabel\
                     stepField errLabel'.w(),

        labelView: SC.LabelView.extend({
            layout: {
                top:     5,
                height: 25,
                left:    0,
                right:   0
            },
            textAlign: SC.ALIGN_CENTER,
            controlSize: SC.LARGE_CONTROL_SIZE,
            value: 'Properties'
        }),

        topLabel: SC.LabelView.extend({
            layout: {
                top:    40,
                height: 25,
                left:   10,
                width:  50
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Top:'
        }),

        leftLabel: SC.LabelView.extend({
            layout: {
                top:    70,
                height: 25,
                left:   10,
                width:  50
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Left:'
        }),

        heightLabel: SC.LabelView.extend({
            layout: {
                top:    100,
                height:  25,
                left:    10,
                width:   50
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Height:'
        }),

        widthLabel: SC.LabelView.extend({
            layout: {
                top:    130,
                height:  25,
                left:    10,
                width:   50
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Width:'
        }),

        topField: SC.TextFieldView.extend({
            layout: {
                top:    40,
                height: 25,
                right:  10,
                width:  60
            },

            fieldValueDidChange: function(partialChange) {
                App.designerController.valueCheckSet('top');

                return YES;
            }
        }),

        leftField: SC.TextFieldView.design({
            layout: {
                top:    70,
                height: 25,
                right:  10,
                width: 60
            },

            fieldValueDidChange: function(partialChange) {
                App.designerController.valueCheckSet('left');

                return YES;
            }
        }),

        heightField: SC.TextFieldView.extend({
            layout: {
                top:    100,
                height:  25,
                right:   10,
                width:   60
            },

            fieldValueDidChange: function(partialChange) {
                App.designerController.valueCheckSet('height');

                return YES;
            }
        }),

        widthField: SC.TextFieldView.extend({
            layout: {
                top:    130,
                height:  25,
                right:   10,
                width:   60
            },

            fieldValueDidChange: function(partialChange) {
                App.designerController.valueCheckSet('width');

                return YES;
            }
        }),

        bindingLabel: SC.LabelView.extend({
            layout: {
                top:    170,
                height:  25,
                left:    10,
                width:   50
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Binding:'
        }),

        bindingSelField: SC.SelectFieldView.extend({
            title: 'SC.SelectFieldView',

            layout: {
                top:    195,
                height:  25,
                left:    10,
                width:  130
            },

            objects: [{
                dataDesc: 'None',
                frequency: 0,
                path: 'rtrt',
                minimum: 0,
                maximum: 0,
                step: 0
            }],

            disableSort: true,
            nameKey: 'dataDesc',
            value: 'None',
            valueKey: 'dataDesc',

            fieldValueDidChange: function() {
                var widSelected = App.designerController.get('widSelected');
                var widPath = App.adminToolsPage.designerContainer.get('childViews')[widSelected];

                this.value = this.getFieldValue();
                widPath.set('bindIO', this.getFieldValue());

                var idx;

                if ((idx = this.objects.getEach('dataDesc').indexOf(this.value)) !== -1) {
                    console.log(idx);
                    var min=this.objects[idx].minimum;
                    var max=this.objects[idx].maximum;
                    var step=this.objects[idx].step;

                    this.parentView.minimumField.set('value', min);
                    this.parentView.minimumField.fieldValueDidChange();
                    this.parentView.maximumField.set('value', max);
                    this.parentView.maximumField.fieldValueDidChange();
                    this.parentView.stepField.set('value', step);
                    this.parentView.stepField.fieldValueDidChange();
                }

                return YES;
            }
        }),

        minimumLabel: SC.LabelView.extend({
            layout: {
                top:    240,
                height:  25,
                left:    10,
                width:   70
            },

            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Minimum:'
        }),

        minimumField: SC.TextFieldView.extend({
            layout: {
                top:    240,
                height:  25,
                right:   10,
                width:   60
            },

            fieldValueDidChange: function(partialChange) {
                var widSelected = App.designerController.get('widSelected');
                var widPath = App.adminToolsPage.designerContainer.get('childViews')[widSelected];

                //  if ((partialChange) && (!App.designerController.get('isMoving')) &&
                if ((widPath.widType === 'Slider') || (widPath.widType === 'Progress')) {
                    App.designerController.valueCheckSet('minimum');
                }

                return YES;
            }
        }),

        maximumLabel: SC.LabelView.extend({
            layout: {
                top: 270,
                height: 25,
                left: 10,
                width: 70
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Maximum:'
        }),

        maximumField: SC.TextFieldView.extend({
            layout: {
                top:    270,
                height:  25,
                right:   10,
                width:   60
            },

            fieldValueDidChange: function(partialChange) {
                var widSelected = App.designerController.get('widSelected');
                var widPath = App.adminToolsPage.designerContainer.get('childViews')[widSelected];

                //  if ((partialChange) && (!App.designerController.get('isMoving')) &&
                if ((widPath.widType === 'Slider') || (widPath.widType === 'Progress')) {
                    App.designerController.valueCheckSet('maximum');
                }

                return YES;
            }
        }),

        stepLabel: SC.LabelView.extend({
            layout: {
                top:    300,
                height:  25,
                left:    10,
                width:   50
            },
            textAlign: SC.ALIGN_LEFT,
            fontWeight: SC.BOLD_WEIGHT,
            value: 'Step:'
        }),

        stepField: SC.TextFieldView.extend({
            layout: {
                top:    300,
                height:  25,
                right:   10,
                width:   60
            },

            fieldValueDidChange: function(partialChange) {
                var widSelected = App.designerController.get('widSelected');
                var widPath = App.adminToolsPage.designerContainer.get('childViews')[widSelected];

                //        if (!App.designerController.get('isMoving')) &&
                if (widPath.widType === 'Slider') {
                    App.designerController.valueCheckSet('step');
                }

                return YES;
            }
        }),

        errLabel: SC.LabelView.extend({
            classNames: ['error-message'],
            layout: {
                top:    335,
                height:  25,
                left:    10,
                right:   10
            },

            textAlign: SC.ALIGN_CENTER,
            valueBinding: 'App.designerController.errMsg'
        })
    })
});
