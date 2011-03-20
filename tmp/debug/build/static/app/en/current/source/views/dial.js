// ==========================================================================
// Project:   App.Dial
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
App.Dial = SC.View.extend(
/** @scope App.Dial.prototype */ {

    // Type of widget
    widType: 'Dial',

    // CSS classes that this view belongs to
    classNames: ['rounded-corners', 'widget-border-none'],

    childViews: 'widgetView'.w(),

    // Layout of the background view housing the widget
    layout: {
        left:     0,
        top:      0,
        width:  300,
        height: 300
    },

    // Path is appended to experiment URL to obtain API URL
    path:'',

    // Time of the most recently acquired data
    // Will be used to request server for data to avoid retrieving old data
    mostRecentTime: '',

    // Indicates if the widget is currently being focused on (NO by default)
    // Focused widgets can have their properties (e.g. layout and bindings) changed
    isActive: NO,

    // Indicates if the widget is capable of being dragged (YES by default)
    // Widget should be draggable in UI designer and immovable during experiment mode
    isDraggable: YES,

    // Schedule a re-render at the end of run-loop when a change has been observed in layout, widget focus or state
    displayProperties: ['layout', 'isActive', 'state'],

    // Default background colour i.e. when widget is not selected (isActive is false)
    //backgroundColor: '#E4E4E4',

    // Widget properties
    minimum: 0,
    maximum: 5,
    value: 0,
    unit: 'V',
    bindIO: 'None',
    selList: [],
    labelList:[],
    dataSet: ['oxygen', 'hydrogen', 'nitrogen'],
    test: 'Hello World',

    // Statechart variables
    state: null,
    logStateChanges: NO,
    currDialPos: 0,   

    // Function is called when object is created
    init: function() {
        arguments.callee.base.apply(this,arguments);
        this.goTransient();
    },

    widgetView: SC.ImageView.extend({
        classNames: ['smooth-turn', 'dial-rotate'],

        layout: {
            centerX:   0,
            centerY:   0,
            width:   150,
            height:  150
        },

        value: '/static/app/en/current/resources/images/knob.png?1296448497'
    }),

    drawSelection: function() {
        var dataSet = this.get('dataSet');
        var selList = this.get('selList');
        var labelList = this.get('labelList');
        var i = 0;
        var selectXPos = 0;
        var selectYPos = 0;
        var degAng = 0;
        var labelSetup = {};

        for (i = 0; i < selList.length; i++) {
            this.removeChild(selList[i]);
            this.removeChild(labelList[i]);
        }

        selList = [];
        labelList = [];

        this.set('value', dataSet[0]);

        for (i = 0; i < dataSet.length; i++) {
            selectXPos = Math.round((65 * Math.cos((((2 * Math.PI) / dataSet.length) * i) - (Math.PI / 4))));
            selectYPos = Math.round((65 * Math.sin((((2 * Math.PI) / dataSet.length) * i) - (Math.PI / 4))));

            selList[i] = App.DialSelection.create({
                layout: {
                    centerX: selectXPos,
                    centerY: selectYPos,
                    width:  20,
                    height: 20
                },
                selOrient: ((360 / dataSet.length) * i),
                selValue: dataSet[i]
            });

            degAng = (i * (360 / dataSet.length));
            console.log('hi there' + degAng);

            if ((degAng > 135) && (degAng <= 315))
                labelSetup = {
                    layout: {
                        centerX: selectXPos - 50,
                        centerY: selectYPos,
                        width:  80,
                        height: 20
                    },
                    textAlign: 'right',
                    value: dataSet[i]
                };

            else
                labelSetup = {
                    layout: {
                        centerX: selectXPos + 50,
                        centerY: selectYPos,
                        width:  80,
                        height: 20
                    },
                    textAlign: 'left',
                    value: dataSet[i]
                };

            labelList[i] = App.DialLabel.create(labelSetup);

            this.appendChild(selList[i]);
            this.appendChild(labelList[i]);
        }

        this.set('selList', selList);
        this.set('labelList', labelList);

        var dialCSS = this.getCSSRule('.smooth-turn.dial-rotate');
        dialCSS.style.MozTransform = 'rotate(0deg)';

        /*
        if ((idx = this.widgetView.classNames.indexOf('dial-' + this.currDialPos)) !== -1)
            this.widgetView.classNames[idx] = 'dial-0';
        else
            this.widgetView.classNames.push('dial-0');
*/
        
        this.set('currDialPos', 0);

        this.displayDidChange();
        this.widgetView.displayDidChange();

        return YES;
    }.observes('dataSet'),

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

    //This function will bind the property panel with the dial when is dragged.
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
                maximum: maximum[i],
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
    },

    addCSSRule: function (ruleName) {                              // Create a new css rule
        if (document.styleSheets) {                                // Can browser do styleSheets?
            if (!this.getCSSRule(ruleName)) {                      // if rule doesn't exist...
                if (document.styleSheets[0].addRule) {             // Browser is IE?
                    document.styleSheets[0].addRule(ruleName, null,0); // Yes, add IE style
                } else {                                           // Browser is IE?
                    document.styleSheets[0].insertRule(ruleName+' { }', 0); // Yes, add Moz style.
                }                                                  // End browser check
            }                                                      // End already exist check.
        }                                                          // End browser ability check.
        return this.getCSSRule(ruleName);                          // return rule we just created.
    },

    getCSSRule: function (ruleName, deleteFlag) {                  // Return requested style obejct
        ruleName = ruleName.toLowerCase();                         // Convert test string to lower case.
        if (document.styleSheets) {                                // If browser can play with stylesheets
            for (var i = 0; i<document.styleSheets.length; i++) {  // For each stylesheet
                var styleSheet = document.styleSheets[i];          // Get the current Stylesheet
                var ii = 0;                                        // Initialize subCounter.
                var cssRule = false;                               // Initialize cssRule.
                do {                                               // For each rule in stylesheet
                    if (styleSheet.cssRules) {                     // Browser uses cssRules?
                        cssRule = styleSheet.cssRules[ii];         // Yes --Mozilla Style
                    } else {                                       // Browser usses rules?
                        cssRule = styleSheet.rules[ii];            // Yes IE style.
                    }                                              // End IE check.
                    if (cssRule)  {                                // If we found a rule...
                        if (cssRule.selectorText.toLowerCase()==ruleName) { // match ruleName?
                            if (deleteFlag === 'delete') {         // Yes.  Are we deleteing?
                                if (styleSheet.cssRules) {         // Yes, deleting...
                                    styleSheet.deleteRule(ii);     // Delete rule, Moz Style
                                } else {                           // Still deleting.
                                    styleSheet.removeRule(ii);     // Delete rule IE style.
                                }                                  // End IE check.
                                return true;                       // return true, class deleted.
                            } else {                               // found and not deleting.
                                return cssRule;                    // return the style object.
                            }                                      // End delete Check
                        }                                          // End found rule name
                    }                                              // end found cssRule
                    ii++;                                          // Increment sub-counter
                } while (cssRule);                                 // end While loop
            }                                                      // end For loop
        }                                                          // end styleSheet ability check
        return false;                                              // we found NOTHING!
    },                                                             // end getCSSRule

    killCSSRule: function (ruleName) {                             // Delete a CSS rule
        return this.getCSSRule(ruleName,'delete');                 // just call getCSSRule w/delete flag.
    }                                                              // end killCSSRule
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');