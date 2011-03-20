// ==========================================================================
// Project:   App.Slider
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

        (Document Your View Here)

 @extends SC.View
 */

App.Slider = SC.View.extend(
    /** @scope App.Slider.prototype */ {

    // Type of widget
    widType: 'Slider',

    isChanged : false,
    // CSS classes that this view belongs to
    classNames: ['rounded-corners'],
    childViews: 'widgetView minView maxView valueView'.w(),

    // Layout of the background view housing the widget
    layout: {
        left:    0,
        top:     0,
        width: 310,
        height: 60
    },

    // Path is appended to experiment URL to obtain API URL
    path: 'dac0',

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
    step: 0.1,
    value: 0,
    unit: 'V',
    bindIO: 'None',

    // Function is called when object is created
    init: function() {
        sc_super();
        this.layoutRel();
    },
    //This function will detect if the slider is changed or not 
    checkSliderChanged:function(){
        var desIn0 = App.expController.get('desiredIn0');
        var currIn0 = App.expController.get('numIn0');
        var desIn1 = App.expController.get('desiredIn1');
        var currIn1 = App.expController.get('numIn1');
        if ((desIn0 !== currIn0) || (desIn1 !== currIn1)) {
            this.set('isChanged',true);
            App.expController.set('numIn0', desIn0);
            App.expController.set('numIn1', desIn1);
        }
        else
            this.set('isChanged',false);
    },

    sendSliderRequest:function()
    {

        console.log("This is Test call function");
       /* var flag=this.get('isChanged');
        if(flag)
        {
            var expID = App.expListController.get('expID');
            var authCookie = SC.Cookie.find('SESS');
            var sendMessage = {
                "out0": App.expController.get('numIn0'),
                "out1": App.expController.get('numIn1')
            };
            SC.Request.putUrl('/rest/param/' + expID)
                    .header({
                'Accept': 'application/json',
                'Cookie': authCookie.name
            })
                    .json()
                    .notify(this, this.didChangeSlider)
                    .send(sendMessage);
        }*/
    },

    dispMin: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ');
            this.beginPropertyChanges()
                    .set('maximum', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges();
        }
        return '%@ %@'.fmt(this.get('minimum'), this.get('unit'));
    }.property('minimum', 'unit').cacheable(),

    dispMax: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ');
            this.beginPropertyChanges()
                    .set('maximum', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges();
        }
        return '%@ %@'.fmt(this.get('maximum'), this.get('unit'));
    }.property('maximum', 'unit').cacheable(),

    dispVal: function(key, value) {
        if (value !== undefined) {
            var parts = value.split(' ');
            this.beginPropertyChanges()
                    .set('value', parts[0])
                    .set('unit', parts[1])
                    .endPropertyChanges();
        }
        return '%@ %@'.fmt(this.get('value'), this.get('unit'));
    }.property('value', 'unit').cacheable(),

    layoutRel: function() {
        this.widgetView.adjust('width', parseInt(this.get('layout').width) - 160);
        this.widgetView.adjust('height', parseInt(this.get('layout').height) - 40);
        return YES;
    }.observes('layout'),

    widgetView: SC.SliderView.extend({
        init: function() {
            sc_super();

            console.log(this.parentView.maximum);
        },

        layout: {
            left:    80,
            top:     10,
            width:  150,
            height:  20
        },

        isEnabled: true,
        minimumBinding: '.parentView.minimum',
        maximumBinding: '.parentView.maximum',
        stepBinding: '.parentView.step',
        valueBinding: '.parentView.value'
    }),

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

    mouseDown: function(evt) {
        var numWid = App.adminToolsPage.designerContainer.get('childViews').length;
        var viewTypeBind = App.designerController.get('viewTypeBind');
        //var widType = this.get('widType');
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
        var step = [];
        var dataDesc = [];
        var expAPI, apiQuery;

        App.designerController.propertiesPane.contentView.minimumField.set('value', String(this.minimum));
        App.designerController.propertiesPane.contentView.maximumField.set('value', String(this.maximum));
        App.designerController.propertiesPane.contentView.stepField.set('value', String(this.step));
        App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', true);
        App.designerController.propertiesPane.contentView.minimumField.set('isVisible', true);
        App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', true);
        App.designerController.propertiesPane.contentView.maximumField.set('isVisible', true);
        App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', true);
        App.designerController.propertiesPane.contentView.stepField.set('isVisible', true);

        apiQuery = SC.Query.local(App.ExpApi, 'transport = "PUT"'); //'ioType = "I"');
        expAPI = App.store.find(apiQuery);
        //dataDesc = expAPI.getEach('dataDesc');

        frequency = expAPI.getEach('frequency');
        path = expAPI.getEach('target');
        expAPI = expAPI.getEach('parameter')[0];
        dataDesc = expAPI.getEach('description');
        minimum = expAPI.getEach('minimum');
        maximum = expAPI.getEach('maximum');

        /*
         apiQuery = SC.Query.local(App.ExpApi, 'ioType = "O"');
         expAPI = App.store.find(apiQuery);
         dataDesc = expAPI.getEach('dataDesc');
         */

        for (i = 0; i < dataDesc.length; i++) {
            comboList[i] = {
                dataDesc: dataDesc[i],
                frequency: frequency[i],
                path: path[i],
                minimum: minimum[i],
                maximum: maximum[i],
                step: 0.1//step[i]
            }
        }

        comboList.unshift({
            dataDesc: 'None',
            frequency: 0,
            path: '',
            minimum: 0,
            maximum: 0,
            step: 0
        });

        //console.log(comboList);

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
