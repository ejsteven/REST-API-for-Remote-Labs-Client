// ==========================================================================
// Project:   App.Switch
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

This is the view for the two way switch widget that be used to control an
experiment.

  @extends SC.View
*/

App.Switch = SC.View.extend(
/** @scope App.Switch.prototype */ {

    widType: 'Switch',

    classNames: ['rounded-corners'],

    layout: {
        top:      0,
        left:     0,
        width:   70,
        height: 130
    },

    isActive: NO,
    displayProperties: ['isActive', 'layout'],
    backgroundColor: '#E4E4E4',
    inSwitch: false,

    childViews: [
        App.DragSwitchHolder.design({
            layout: {
                top:     10,
                left:    10,
                width:   50,
                height:  50
            },

            childViews: [
                App.DragSwitch.design({
                    layout: {
                        centerX:  0,
                        centerY:  0,
                        width:   30,
                        height:  30
                    }
                })
            ]
        }),

        App.DragSwitchHolder.design({
            layout: {
                top:     70,
                left:    10,
                width:   50,
                height:  50
            }
        })
    ],

    mouseDown: function(evt) {
        var numWid = App.adminToolsPage.designerContainer.get('childViews').length;
        var viewTypeBind = App.designerController.get('viewTypeBind');
        var widType = this.get('widType');
        var layout = this.get('layout');
        var i = 0;

        for (i = 4; i < numWid; i++) {
            if (App.adminToolsPage.designerContainer.get('childViews')[i] === this) {
                App.designerController.set('widSelected', i);
                App.designerController.propertiesPane.contentView.bindingSelField.set('value', this.get('bindIO'));
            }
        }

        App.designerController.set('isMoving', true);
        console.log(App.designerController.get('isMoving'));

        this._mouseDownInfo = {
            left: layout.left,
            top: layout.top,
            pageX: evt.pageX,
            pageY: evt.pageY
        };

        var dataDesc = [];
        var expAPI, apiQuery;

        App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', false);
        App.designerController.propertiesPane.contentView.minimumField.set('isVisible', false);
        App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', false);
        App.designerController.propertiesPane.contentView.maximumField.set('isVisible', false);
        App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', false);
        App.designerController.propertiesPane.contentView.stepField.set('isVisible', false);

        apiQuery = SC.Query.local(App.ExpApi, 'transport = "GET"'); //'ioType = "I"');
        expAPI = App.store.find(apiQuery);
        dataDesc = expAPI.getEach('return');
        dataDesc = dataDesc.getEach('description');

        for (var i = 0; i < dataDesc.length; i++) {
            dataDesc[i] = {dataDesc: dataDesc[i]};
        }

        dataDesc.unshift({dataDesc: "None"});

        App.designerController.propertiesPane.contentView.bindingSelField.set('objects', dataDesc);

        // Set all widgets back to default background colour and inactive
        for (i = 4; i < numWid; i++) {
            App.adminToolsPage.designerContainer.get('childViews')[i].set('backgroundColor', '#E4E4E4');
            App.adminToolsPage.designerContainer.get('childViews')[i].set('isActive', NO);
        }

        // Highlight the currently selected widget by changing to a unique colour and set as active
        this.set('isActive', YES);
        this.set('backgroundColor', '#254981');

        App.designerController.propertiesPane.contentView.topField.set('value', String(layout.top));
        App.designerController.propertiesPane.contentView.leftField.set('value', String(layout.left));
        App.designerController.propertiesPane.contentView.heightField.set('value', String(layout.height));
        App.designerController.propertiesPane.contentView.widthField.set('value', String(layout.width));

        console.log(App.designerController.get('widSelected'));

        return YES;
    },

    mouseDragged: function(evt) {
        if (!this.get('inSwitch')) {
            var info = this._mouseDownInfo,
                    size = this.get('pane').get('currentWindowSize'),
                    loc, top, left;

            loc = evt.pageX;
            if (loc < 0) loc = 0;
            if (loc > size.width) loc = size.width;
            left = info.left + (loc - info.pageX);

            loc = evt.pageY;
            if (loc < 0) loc = 0;
            if (loc > size.height) loc = size.height;
            top = info.top + (loc - info.pageY);

            this.adjust('top', top).adjust('left', left);
            App.designerController.propertiesPane.contentView.topField.set('value', String(top));
            App.designerController.propertiesPane.contentView.leftField.set('value', String(left));
        }
        return YES;
    },

    mouseUp: function(evt) {
        this.mouseDragged(evt);
        this._mouseDownInfo = null;

        App.designerController.set('isMoving', false);
        console.log(App.designerController.get('isMoving'));

        return YES;
    }

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');