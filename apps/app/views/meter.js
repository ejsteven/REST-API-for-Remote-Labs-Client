// ==========================================================================
// Project:   App.Meter
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
App.Meter = SC.View.extend(
/** @scope App.Meter.prototype */ {

    // Type of widget
    widType: 'Meter',

    // CSS classes that this view belongs to
    classNames: ['rounded-corners', 'widget-border-none'],

    childViews: 'backView widgetView frontView minView maxView valueView'.w(),

    // Layout of the background view housing the widget
    layout: {
        left:     0,
        top:      0,
        width:  470,
        height: 270
    },

    // Path is appended to experiment URL to obtain API URL
    path:'',

    // Time of the most recently acquired data
    // Will be used to request server for data to avoid retrieving old data
    mostRecentTime: 0,

    // Indicates if the widget is currently being focused on (NO by default)
    // Focused widgets can have their properties (e.g. layout and bindings) changed
    isActive: NO,

    // Indicates if the widget is capable of being dragged (YES by default)
    // Widget should be draggable in UI designer and immovable during experiment mode
    isDraggable: YES,

    // Schedule a re-render at the end of run-loop when a change has been observed in layout, widget focus or state
    displayProperties: ['layout', 'isActive', 'state'],

    // Default background colour i.e. when widget is not selected (isActive is false)
    backgroundColor: '#E4E4E4',

    // Widget properties
    minimum: 0,
    maximum: 5,
    value: 0,
    unit: 'V',
    bindIO: 'None',

    path: 'in1',

    // Statechart variables
    state: null,
    logStateChanges: YES,

    // Function is called when object is created
    init: function() {
        sc_super();
        this.goTransient();
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

    //get the expData from the server
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

    //When the pause Button is triggered set the isPause variable to false
    resumeTimer: function() {
        this.pollTimer.set('isPaused', NO);
    },

    //
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

   //this function will get tha value and split it as two parts minimum and units 
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
   //this function will get tha value and split it as two parts maximum and units
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

   //This function will get the value and split it into two parts value and usnits
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

    //The widget view that is implemented as an image 
    widgetView: SC.ImageView.extend({
        classNames:['ease-transit','hand-10'],
        prevDeg: 0,
        init: function() {
            sc_super();

            this.handPos();
        },

        layout: {
            centerX:   0,
            bottom:   40,
            width:   400,
            height:    3
        },

        value: sc_static('images/hand.png'),
        handValBinding: '.parentView.value',

        handPos: function() {
            var range = 5;
            var map = [];
            var i = 0;

            for (i = 0; i < 33; i++) {
                map.push(5 * i/32);
            }

            for (i = 0; i < map.length; i++) {
                if (this.classNames[i] === ('hand-' + this.get('prevDeg'))) {
                    console.log('Hi ' + i);
                    this.classNames.splice(i, 1);
                }
            }

            i = 0;
            while (map[i] < this.get('handVal')) {
                i++;
            }


            console.log('blah ' + map[i] + ' ' + this.get('handVal'));

            this.classNames.push('hand-' + ((i + 2) * 5));
            this.set('prevDeg', ((i + 2) * 5));

            this.displayDidChange();
            return YES;
        }.observes('handVal')
    }),

   //The backview 
    backView: SC.ImageView.extend({
        classNames: ['rounded-corners'],
        layout: {
            left:    10,
            top:     10,
            width:  450,
            height: 250
        },
        value: sc_static('images/VUmeter-back.png')
    }),

    frontView: SC.ImageView.extend({
        classNames: ['rounded-corners'],
        layout: {
            left:    10,
            top:     10,
            width:  450,
            height: 250
        },
        value: sc_static('images/VUmeter-front.png')
    }),
   //Bind the minumum value label from the parent view to the actual meter view
    minView: SC.LabelView.extend({
        layout: {
            left:   10,
            width:  60,
            bottom: 30,
            height: 20
        },

        value: 'Min',
        textAlign: 'right',
        valueBinding: '.parentView.dispMin'
    }),
   //Bind the maximum value label from the parent view to the actual meter view
    maxView: SC.LabelView.extend({
        layout: {
            right:  10,
            width:  60,
            bottom: 30,
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

    //the folowing functions will make the events as state of chart 

    goTransient: function() {
        this.set('state', 'transient');

        if (this.logStateChanges)
            console.log(this.get('state'));

        if (this.get('isDraggable'))
            this.goMouseOutMouseUp();
        else
            this.goStationary();
    },

    goStationary: function() {
        this.set('state', 'stationary');

        if (this.logStateChanges)
            console.log(this.get('state'));
    },

    goMouseOutMouseUp: function() {
        this.set('state', 'mouseOutMouseUp');


        if (this.logStateChanges)
            console.log(this.get('state'));
    },
    
    goMouseOverMouseUp: function() {
        this.set('state', 'mouseOverMouseUp');

        if (this.logStateChanges)
            console.log(this.get('state'));
    },

    goMouseOverMouseDown: function() {
        this.set('state', 'mouseOverMouseDown');

        if (this.logStateChanges)
            console.log(this.get('state'));
    },

    goMouseDragged: function() {
        this.set('state', 'mouseDragged');

        if (this.logStateChanges)
            console.log(this.get('state'));
    },

    mouseUp: function(evt) {
        if ((this.get('state') === 'mouseOverMouseDown') || (this.get('state') === 'mouseDragged')) {
            this.goMouseOverMouseUp();

            this.widgetSelected();

            this.mouseDragged(evt);
            this._mouseDownInfo = null;

            return YES;
        }
    },



  //This function will bind the property panel with the meter when is dragged.
    widgetSelected: function() {
        var numWid = App.adminToolsPage.designerContainer.get('childViews').length;
        var viewTypeBind = App.designerController.get('viewTypeBind');
        var layout = this.get('layout');
        var i = 0;

        for (i = 4; i < numWid; i++) {
            if (App.adminToolsPage.designerContainer.get('childViews')[i] === this) {
                App.designerController.set('widSelected', i);
                App.designerController.propertiesPane.contentView.bindingSelField.set('value', this.get('bindIO'));
            }
        }


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


    /*When the mouse is click the Meter object it will
         1.check wheather the state is mouseOverMouseUp 
           if yes then call the goMouseOverMouseDown() function thats mean go to the next state

     */

    mouseDown: function(evt) {
        if (this.get('state') === 'mouseOverMouseUp') {
            this.goMouseOverMouseDown();

            var layout = this.get('layout');
            
            this._mouseDownInfo = {
                pageX: evt.pageX, // save mouse pointer loc for later use
                pageY: evt.pageY,
                left:  layout.left, // save layout info
                top: layout.top
            };

            return YES;
        }
    },

    mouseEntered: function() {
        if (this.get('state') === 'mouseOutMouseUp') {
            this.goMouseOverMouseUp();

            var idx = 0;

            if ((idx = this.get('classNames').indexOf('widget-border-none')) !== -1)
                this.classNames[idx] = 'widget-border-highlight';
            else
                this.classNames.push('widget-border-highlight');

            this.displayDidChange();
            return YES;
        }
    },

    mouseExited: function() {
        if (this.get('state') === 'mouseOverMouseUp') {
            this.goMouseOutMouseUp();

            var idx = 0;

            if ((idx = this.get('classNames').indexOf('widget-border-highlight')) !== -1)
                this.classNames[idx] = 'widget-border-none';
            else
                this.classNames.push('widget-border-none');

            this.displayDidChange();

            return YES;
        }
    },

    mouseDragged: function(evt) {
        if ((this.get('state') === 'mouseOverMouseDown') || (this.get('state') === 'mouseDragged')) {
            this.goMouseDragged();

            var info = this._mouseDownInfo,
                loc;

            // handle X direction
            loc = info.left + (evt.pageX - info.pageX);
            this.adjust('left', loc);

            // handle Y direction
            loc = info.top + (evt.pageY - info.pageY) ;
            this.adjust('top', loc);

            return YES ; // event was handled!
        }
    }
});
