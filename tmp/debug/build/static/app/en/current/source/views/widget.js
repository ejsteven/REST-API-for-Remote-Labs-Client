// ==========================================================================
// Project:   App.Widget
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

App.Widget = SC.View.extend(
/** @scope App.Widget.prototype */ {

    init: function() {

        arguments.callee.base.apply(this,arguments);
    },

    mouseDown: function(evt) {
        var i = 0;
        var numWid = App.designerPage.creatorContainer.get('childViews').length;
        var layout = this.get('layout');
        var viewTypeBind = App.designerController.get('viewTypeBind');
        var widType = '';

        for (i = 4; i < numWid; i++) {
            if (App.designerPage.creatorContainer.get('childViews')[i] === this) {
                App.designerController.set('widSelected', i);
                App.designerController.propertiesPane.contentView.bindingSelField.set('value', viewTypeBind[i - 4].bind);
                widType = viewTypeBind[i - 4].type;
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

        if ((widType === 'ProgressView') || (widType === 'GraphView')) {
            apiQuery = SC.Query.local(App.ExpApi, 'ioType = "I"');
            expAPI = App.store.find(apiQuery);
            dataDesc = expAPI.getEach('dataDesc');
            if (widType === 'ProgressView') {
                App.designerController.propertiesPane.contentView.minimumField.set('value', String(this.get('childViews')[0].minimum));
                App.designerController.propertiesPane.contentView.maximumField.set('value', String(this.get('childViews')[0].maximum));
                App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', true);
                App.designerController.propertiesPane.contentView.minimumField.set('isVisible', true);
                App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', true);
                App.designerController.propertiesPane.contentView.maximumField.set('isVisible', true);
                App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', false);
                App.designerController.propertiesPane.contentView.stepField.set('isVisible', false);
            } else if (widType === 'GraphView') {
                App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', false);
                App.designerController.propertiesPane.contentView.minimumField.set('isVisible', false);
                App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', false);
                App.designerController.propertiesPane.contentView.maximumField.set('isVisible', false);
                App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', false);
                App.designerController.propertiesPane.contentView.stepField.set('isVisible', false);
            }
        } else if (widType === 'SliderView') {
            apiQuery = SC.Query.local(App.ExpApi, 'ioType = "O"');
            expAPI = App.store.find(apiQuery);
            dataDesc = expAPI.getEach('dataDesc');
            App.designerController.propertiesPane.contentView.minimumField.set('value', String(this.get('childViews')[0].minimum));
            App.designerController.propertiesPane.contentView.maximumField.set('value', String(this.get('childViews')[0].maximum));
            App.designerController.propertiesPane.contentView.stepField.set('value', String(this.get('childViews')[0].step));
            App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', true);
            App.designerController.propertiesPane.contentView.minimumField.set('isVisible', true);
            App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', true);
            App.designerController.propertiesPane.contentView.maximumField.set('isVisible', true);
            App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', true);
            App.designerController.propertiesPane.contentView.stepField.set('isVisible', true);
        }

        for (var i = 0; i < dataDesc.length; i++) {
            dataDesc[i] = {dataDesc: dataDesc[i]};
        }

        dataDesc.unshift({dataDesc: "None"});

        App.designerController.propertiesPane.contentView.bindingSelField.set('objects', dataDesc);

        // Set all widgets back to default background colour and inactive
        for (i = 4; i < numWid; i++) {
            App.designerPage.creatorContainer.get('childViews')[i].set('backgroundColor', '#254981');
            App.designerPage.creatorContainer.get('childViews')[i].set('isActive', NO);
        }

        // Highlight the currently selected widget by changing to a unique colour and set as active
        this.set('isActive', YES);
        this.set('backgroundColor', '#E4E4E4');

        App.designerController.propertiesPane.contentView.topField.set('value', String(layout.top));
        App.designerController.propertiesPane.contentView.leftField.set('value', String(layout.left));
        App.designerController.propertiesPane.contentView.heightField.set('value', String(layout.height));
        App.designerController.propertiesPane.contentView.widthField.set('value', String(layout.width));

        console.log(App.designerController.get('widSelected'));

        return YES;
    },

    mouseDragged: function(evt) {
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