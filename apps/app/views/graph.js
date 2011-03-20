// ==========================================================================
// Project:   App.Graph
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

App.Graph = SC.View.extend(
/** @scope App.Graph.prototype */ {

    classNames: ['rounded-corners'],
    widType: 'Graph',

    init: function() {
        sc_super();
        this.layoutRel();
    },

    childViews: 'widgetView xLabelView yLabelView'.w(),

    layout: {
        left:     0,
        top:      0,
        width:  190,
        height: 190
    },

    isActive: NO,
    displayProperties: ['isActive', 'layout'],
    backgroundColor: '#E4E4E4',
    bindIO: 'None',
    unit: 'V',
    data: [SC.Object.create({})],

    dispYLab: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ') ;
            this.beginPropertyChanges()
                    .set('bindIO', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges() ;
        }
        return '%@ (%@)'.fmt(this.get('bindIO'), this.get('unit'));
    }.property('bindIO', 'unit').cacheable(),

    layoutRel: function() {
        this.widgetView.adjust('width', parseInt(this.get('layout').width) - 40);
        this.widgetView.adjust('height', parseInt(this.get('layout').height) - 40);
        return YES;
    }.observes('layout'),

    widgetView: Flot.GraphView.extend({
        layout: {
            left:    30,
            top:     10,
            width:  150,
            height: 150
        },
        dataBinding: '.parentView.data'
    }),

    xLabelView: SC.LabelView.extend({
        layout: {
            centerX: 20,
            width:   60,
            bottom:  10,
            height:  20
        },

        value: 'Time (s)',
        textAlign: 'center'
    }),

    yLabelView: SC.LabelView.extend({
        classNames: ['y-axis-label'],
        layout: {
            centerY: -20,
            width:   60,
            left:    -10,
            height:  20
        },

        valueBinding: '.parentView.dispYLab',
        textAlign: 'center'
    }),

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
        //dataDesc = expAPI.getEach('dataDesc');

        dataDesc = expAPI.getEach('return');
        dataDesc = dataDesc.getEach('description');

        /*
         apiQuery = SC.Query.local(App.ExpApi, 'ioType = "I"');
        expAPI = App.store.find(apiQuery);
        dataDesc = expAPI.getEach('dataDesc'); */

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
