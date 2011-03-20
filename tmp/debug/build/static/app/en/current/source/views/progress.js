// ==========================================================================
// Project:   App.Progress
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
App.Progress = SC.View.extend(
/** @scope App.Progress.prototype */ {

    // Type of Widget
    widType: 'Progress',

    childViews: 'widgetView minView maxView valueView'.w(),

    // CSS classes that this view belongs to
    classNames: ['rounded-corners'],

    // Layout of the background view housing the widget
    layout: {
        left:    0,
        top:     0,
        width: 310,
        height: 60
    },

    // Path is appended to experiment URL to obtain API URL
    path: '',

    // Time of the most recently acquired data
    // Will be used to request server for data to avoid retrieving old data
    mostRecentTime: 0,

    // Indicates if the widget is currently being focused on
    // Focused widgets can have their properties (e.g. layout and bindings) changed
    isActive: NO,

    // Schedule a re-render at the end of run-loop when a change has been observed in layout or widget focus
    displayProperties: ['isActive', 'layout'],

    // Default background colour i.e. when widget is not selected (isActive is false)
    backgroundColor: '#E4E4E4',

    // Widget properties
    minimum: 0,
    maximum: 5,
    value: 0,
    unit: 'V',
    bindIO: 'None',

    path: 'in0',

    // Function is called when object is created
    init: function() {
        arguments.callee.base.apply(this,arguments);
        this.layoutRel();
    },

    // Function to set a timer to send a request each 1000 ms
    startTimer: function() {
        this.set('pollTimer', SC.Timer.schedule({
            target: this,
            action: 'getExpData',
            interval: 1000,
            repeats: YES
        }));
    },

    getExpData: function() {
        var expID = App.expListController.get('expID');
        var authCookie = SC.Cookie.find('SESS');
        var path = this.get('path');
        var pollMessage = expID + '/' + path + '/' + this.get('mostRecentTime');
        SC.Request.getUrl('/rest/single/' + pollMessage)
                .header({
            'Cookie': authCookie.name
        })
        .json()
        .notify(this, this.didExpData)
        .send();
    },

    pauseTimer: function() {
        this.pollTimer.set('isPaused', YES);
    },

    resumeTimer: function() {
        this.pollTimer.set('isPaused', NO);
    },

    stopTimer: function() {
        this.pollTimer.invalidate();
    },

    didExpData:function(response){
        if (SC.ok(response)) {
            if (response.get('body') !== 'empty') {
                var data = response.get('body');
                var length = data.length;

                this.set('value', data[length - 1].dataVal);
                this.set('mostRecentTime', data[length - 1].time);
            }
        }
    },

    // Minimum value computed property calculated by combining minimum value with unit
    dispMin: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ') ;
            this.beginPropertyChanges()
                    .set('minimum', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges() ;
        }
        return '%@ %@'.fmt(this.get('minimum'), this.get('unit'));
    }.property('minimum', 'unit').cacheable(),

    // Maximum value computed property calculated by combining maximum value with unit
    dispMax: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ') ;
            this.beginPropertyChanges()
                    .set('maximum', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges() ;
        }
        return '%@ %@'.fmt(this.get('maximum'), this.get('unit'));
    }.property('maximum', 'unit').cacheable(),

    // Current value computed property calculated by combining current value with unit
    dispVal: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ') ;
            this.beginPropertyChanges()
                    .set('value', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges() ;
        }
        return '%@ %@'.fmt(this.get('value'), this.get('unit'));
    }.property('value', 'unit').cacheable(),

    // Change widget layout based on the layout of the parent background view
    layoutRel: function() {
        this.widgetView.adjust('width', parseInt(this.get('layout').width) - 160);
        this.widgetView.adjust('height', parseInt(this.get('layout').height) - 40);
        return YES;
    }.observes('layout'),

    // Progress bar widget
    widgetView: SC.ProgressView.extend({
        layout: {
            left:    80,
            top:     10,
            width:  150,
            height:  20
        },

        isEnabled: true,
        minimumBinding: '.parentView.minimum',
        maximumBinding: '.parentView.maximum',
        valueBinding: '.parentView.value'
    }),

    // Label for displaying the minimum value of the widget
    minView: SC.LabelView.extend({
        layout: {
            left:   10,
            width:  60,
            top:    10,
            height: 20
        },

        value: 'Min',
        textAlign: 'right',
        valueBinding: '.parentView.dispMin'
    }),

    // Label for displaying the maximum value of the widget
    maxView: SC.LabelView.extend({
        layout: {
            right:  10,
            width:  60,
            top:    10,
            height: 20
        },

        value: 'Max',
        textAlign: 'left',
        valueBinding: '.parentView.dispMax'
    }),

    // Label for displaying the current value of the widget
    valueView: SC.LabelView.extend({
        layout: {
            centerX: 0,
            width:  60,
            bottom: 10,
            height: 20
        },

        value: 'Value',
        textAlign: 'center',
        valueBinding: '.parentView.dispVal'
    }),

    // Function is called when there is a mouse down event over the view
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

    
        var frequency = [];
        var comboList = [];
        var desc = [];
        var path = [];
        var minimum = [];
        var maximum = [];
        var dataDesc = [];
        var expAPI, apiQuery;        

        App.designerController.propertiesPane.contentView.minimumField.set('value', String(this.minimum));
        App.designerController.propertiesPane.contentView.maximumField.set('value', String(this.maximum));
        App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', true);
        App.designerController.propertiesPane.contentView.minimumField.set('isVisible', true);
        App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', true);
        App.designerController.propertiesPane.contentView.maximumField.set('isVisible', true);
        App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', false);
        App.designerController.propertiesPane.contentView.stepField.set('isVisible', false);

        apiQuery = SC.Query.local(App.ExpApi, 'transport = "GET"');
        expAPI = App.store.find(apiQuery);


        frequency = expAPI.getEach('frequency');
        path = expAPI.getEach('target');
        expAPI = expAPI.getEach('return');
        dataDesc = expAPI.getEach('description');
        minimum = expAPI.getEach('minimum');
        maximum = expAPI.getEach('maximum');


        for (i = 0; i < dataDesc.length; i++) {
             comboList[i] = {
                dataDesc: dataDesc[i],
                frequency: frequency[i],
                path: path[i],
                minimum: minimum[i],
                maximum: maximum[i]
            }
        }

      comboList.unshift({
            dataDesc: 'None',
            frequency: 0,
            path: '',
            minimum: 0,
            maximum: 0
        });


        App.designerController.propertiesPane.contentView.bindingSelField.set('objects', comboList);

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

    // Function is called where there is a drag event
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

    // Function is called when there is a mouse up up event over the widget
    mouseUp: function(evt) {
        this.mouseDragged(evt);
        this._mouseDownInfo = null;

        App.designerController.set('isMoving', false);
        console.log(App.designerController.get('isMoving'));

        return YES;
    }
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');