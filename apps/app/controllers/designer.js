// ==========================================================================
// Project:   App.designerController
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/

App.designerController = SC.ArrayController.create(SC.CollectionViewDelegate,
/** @scope App.adminController.prototype */ {

    showWidgets: false,
    showProperties: false,
    isMoving: false,
    widSelected: 0,
    viewList: [],
    indNum: '',
    errMsg: '',

    // Returns experiment ID of selected experiment
    collectionViewShouldSelectIndexes: function(view, indexes, extend) {
        var ind = indexes.get('min');
        this.set('indNum',ind);
        return indexes;
    },

    //This function will return the administrators back to the adminShow container when the cancel button is triggered
    CancelExperiment:function()
    {
        App.adminController.set('nowShowing','adminContainer');
    },

    /** When the confirmExperiment button triggered this function will do the following tasks:
     *   1. Switch to the designerContainer.
     *   2. obtain a description of the eperiment API
     */
    confirmExperiment:function(){
        var ind = App.expListController.get('indNum');
        if (ind !== '') {
            var indRec = App.store.find(App.Explist);
            var rec = indRec.objectAt(ind);
            var expID = rec.getEach('expID');
            var authCookie = SC.Cookie.find('SESS');

            //send a reserver request to the server
            SC.Request.getUrl('/rest/api/' + expID)
                .header({
                    'Cookie': authCookie.name
                })
                .json()
                .notify(this, this.readExpAPI)
                .send();

            //Switch to the create container
            App.adminController.showDesignerCanvas();
        } else
            alert("You must select an experiment to associate with the custom UI!");
    },

    // Function for checking the string 'teststr' to see if it is numeric
    isDecimal: function(teststr) {
        return (this.isNumber('Decimal', teststr));
    },

    isInteger: function(teststr) {
        return (this.isNumber('Integer', teststr));
    },

    isNumber: function(numtype, teststr) {
        var strValidChars = '';
        var strChar;
        var blnResult = true;
        var numDecPts = 0;
        var numList = '0123456789';

        if (numtype === 'Integer')
            strValidChars = '0123456789-';
        else if (numtype === 'Decimal')
            strValidChars = '0123456789.-';

        if (teststr.length == 0) return false;

        for (i = 0; i < teststr.length && blnResult === true; i++) {
            strChar = teststr.charAt(i);
            prevStrChar = teststr.charAt(i - 1);

            if (strChar === '.')
                numDecPts++;

            if ((strValidChars.indexOf(strChar) === -1) || ((i > 0) && (strChar === '-'))
                    || (numDecPts > 1) || ((numList.indexOf(prevStrChar) === -1) && (strChar === '.')))
                blnResult = false;
        }

        return blnResult;
    },

    valueCheckSet: function(layoutelem) {
        var widSelected = App.designerController.get('widSelected');
        var widPath = App.adminToolsPage.designerContainer.get('childViews')[widSelected];
        var fieldPath;

        if (layoutelem === 'top')
            fieldPath = this.propertiesPane.contentView.topField;
        else if (layoutelem === 'left')
            fieldPath = this.propertiesPane.contentView.leftField;
        else if (layoutelem === 'height')
            fieldPath = this.propertiesPane.contentView.heightField;
        else if (layoutelem === 'width')
            fieldPath = this.propertiesPane.contentView.widthField;
        else if (layoutelem === 'minimum')
            fieldPath = this.propertiesPane.contentView.minimumField;
        else if (layoutelem === 'maximum')
            fieldPath = this.propertiesPane.contentView.maximumField;
        else if (layoutelem === 'step')
            fieldPath = this.propertiesPane.contentView.stepField;

        //    if (!App.designerController.get('isMoving')) {
        if ((fieldPath.getFieldValue() === ('-')) || (fieldPath.getFieldValue() === ('.')))
            this.set('errMsg', '');

        /*} else */
        else if (((layoutelem === 'top') || (layoutelem === 'left') || (layoutelem === 'height')
                || (layoutelem === 'width')) && (App.designerController.isInteger(fieldPath.getFieldValue()))) {
            this.set('errMsg', '');
            fieldPath.value = fieldPath.getFieldValue();
            widPath.adjust(layoutelem, parseFloat(fieldPath.getFieldValue()));

        } else if (((layoutelem === 'minimum') || (layoutelem === 'maximum') || (layoutelem === 'step'))
                && (App.designerController.isDecimal(fieldPath.getFieldValue()))) {
            this.set('errMsg','');
            fieldPath.value = fieldPath.getFieldValue();
            widPath.set(layoutelem, parseFloat(fieldPath.getFieldValue()));

        } else {
            fieldPath.setFieldValue('');
            fieldPath.value = fieldPath.getFieldValue();
            this.set('errMsg', 'Value not numeric');

            return NO;
        }

        return YES;
    },

    readExpAPI: function(response) {
        var resBody = response.get('body');

/*        //  console.log(JSON.parse(resBody[0].ioJSON).urlExt);
        resBody = resBody.getEach('expAPI');

        resBody[i] = JSON.parse(resBody[0]);

        for (var i = 0; i < resBody.length; i++) {
            resBody[i] = JSON.parse(resBody[i]);
        }
        //var happyBody = JSON.parse(resBody);
        console.log(resBody);*/

        var JSONAPI = {};
        var recordsList = [];

        resBody = resBody.getEach('expAPI')[0];
        resBody = JSON.parse(resBody);

        for (var key in resBody)
        {
            if(resBody.hasOwnProperty(key)) {
                JSONAPI = resBody["services"];
            }
        }

        var i = 0;
        for (var key in JSONAPI)
        {
            if(JSONAPI.hasOwnProperty(key))
            {
                recordsList[i]=JSONAPI[key];
                i++;
            }
        }

        console.log(recordsList);

        App.store.createRecords(App.ExpApi, recordsList.isEnumerable ? recordsList : [recordsList]);
        //App.store.createRecords(App.ExpApi, resBody.isEnumerable ? resBody : [resBody]);
    },
    /*
     createPanes: function() {
     var widPane = App.WidgetsPanel.create();
     var propPane = App.PropertiesPanel.create();
     widPane.append();
     propPane.append();
     this.set('widgetsPane', widPane);
     this.set('propertiesPane', propPane);
     this.widgetsPane.set('isVisible', NO);
     this.propertiesPane.set('isVisible', NO);
     },

     destroyWigetsPanes: function() {
     App.adminToolsPage.designerContainer.widgetsButton.set('title', 'Show Widgets');
     App.adminToolsPage.designerContainer.propertiesButton.set('title', 'Show Properties');
     this.widgetsPane.remove();
     this.propertiesPane.remove();
     this.set('showWidgets', false);
     this.set('showProperties', false);
     },

     showHideWidgetsPane: function() {
     var showWidgets = this.get('showWidgets');

     if (!showWidgets) {
     this.propertiesPane.set('isVisible', YES);
     this.set('showWidgets', true);
     App.adminToolsPage.designerContainer.widgetsButton.set('title', 'Hide Widgets');
     } else {
     this.propertiesPane.set('isVisible', NO);
     this.set('showWidgets', false);
     App.adminToolsPage.designerContainer.widgetsButton.set('title', 'Show Widgets');
     }
     },

     showHidePropertiesPane: function() {
     var showProperties = this.get('showProperties');

     if (!showProperties) {
     this.widgetsPane.set('isVisible', YES);
     this.set('showProperties', true);
     App.adminToolsPage.designerContainer.propertiesButton.set('title', 'Hide Properties');
     } else {
     this.widgetsPane.set('isVisible', NO);
     this.set('showProperties', false);
     App.adminToolsPage.designerContainer.propertiesButton.set('title', 'Show Properties');
     }
     }, */


    showHideWidgetsPane: function() {
        var showWidgets = this.get('showWidgets');
        if (!showWidgets) {
            var pane = App.WidgetsPanel.create();
            pane.append();
            this.set('widgetsPane', pane);
            this.set('showWidgets', true);
            App.adminToolsPage.designerContainer.widgetsButton.set('title', 'Hide Widgets');
    //        this.widgetsPane.set('isVisible', NO);
    //        this.widgetsPane.set('isVisible', YES);
        } else {
            this.set('showWidgets', false);
            App.adminToolsPage.designerContainer.widgetsButton.set('title', 'Show Widgets');
            App.designerController.widgetsPane.remove();
        }
    },

    showHidePropertiesPane: function() {
        var showProperties = this.get('showProperties');
        if (!showProperties) {
            var pane = App.PropertiesPanel.create();
            pane.append();
            this.set('propertiesPane', pane);
            this.set('showProperties', true);
            App.adminToolsPage.designerContainer.propertiesButton.set('title', 'Hide Properties');
        //    this.propertiesPane.set('isVisible', NO);
        //    this.propertiesPane.set('isVisible', YES);
        } else {
            this.set('showProperties', false);
            App.adminToolsPage.designerContainer.propertiesButton.set('title', 'Show Properties');
            App.designerController.propertiesPane.remove();
        }
    },

    addSlider: function() {
        this.addWidget('Slider');
    },

    addProgress: function() {
        this.addWidget('Progress');
    },

    addGraph: function() {
        this.addWidget('Graph');
    },

    addSwitch: function() {
        this.addWidget('Switch');
    },

    addCam: function() {
        this.addWidget('Cam');
    },

    addMeter: function() {
        this.addWidget('Meter');
    },

    addDial: function() {
        this.addWidget('Dial');  
    },

    addWidget: function(widtype) {
        var viewList = App.designerController.get('viewList');

        if (widtype === "Slider") {
            viewList[viewList.length] = App.Slider.create();
        } else if (widtype === "Progress") {
            viewList[viewList.length] = App.Progress.create();
        } else if (widtype === "Graph") {
            viewList[viewList.length] = App.Graph.create();
        } else if (widtype === 'Switch') {
            viewList[viewList.length] = App.Switch.create();
        } else if (widtype === 'Cam') {
            viewList[viewList.length] = App.Cam.create();
        } else if (widtype === 'Meter') {
            viewList[viewList.length] = App.Meter.create();
        } else if (widtype === 'Dial') {
            viewList[viewList.length] = App.Dial.create();
        }
        
        App.adminToolsPage.designerContainer.appendChild(viewList[viewList.length - 1]);
        this.set('viewList', viewList);
    },

    deleteWidget: function() {
        console.log(this.widSelected);
        App.adminToolsPage.designerContainer.removeChild(this.viewList[this.get('widSelected')]);
        this.viewList.splice(this.get('widSelected'), 1);
        App.adminToolsPage.designerContainer.displayDidChange();
    },

    saveCustomView: function() {
        var widElem = {};
        var widArray = [];
        var widName = '';
        var numWid = App.adminToolsPage.designerContainer.get('childViews').length;
        console.log("Number of children is: " + numWid);

        for (var i = 4; i < numWid; i++) {
            var widPath = App.adminToolsPage.designerContainer.get('childViews')[i];
            widElem = {};
            widElem.widType = widPath.widType;
            widElem.layout = {};
            widElem.layout.top = widPath.layout.top;
            widElem.layout.left = widPath.layout.left;
            widElem.layout.height = widPath.layout.height;
            widElem.layout.width = widPath.layout.width;

            if (widPath.widType === 'Slider') {
   //             if (widPath.bindIO === 'VSource') {
                    widElem.valueBinding = "App.expController.desiredIn0";
       //         } else if (widPath.bindIO === 'Output 1') {
        //            widElem.valueBinding = "App.expController.desiredOut1";
          //      }
                widElem.minimum = widPath.minimum;
                widElem.maximum = widPath.maximum;
                widElem.step = widPath.step;
            } else if (widPath.widType === 'Progress') {
                if (widPath.bindIO === 'Output 0') {
                    widElem.valueBinding = "App.expController.numOut0";
                } else if (widPath.bindIO === 'Output 1') {
                    widElem.valueBinding = "App.expController.numOut1";
                } else if (widPath.bindIO === 'Output 2') {
                    widElem.valueBinding = "App.expController.numOut2";
                } else if (widPath.bindIO === 'Output 3') {
                    widElem.valueBinding = "App.expController.numOut3";
                }

                widElem.minimum = widPath.minimum;
                widElem.maximum = widPath.maximum;
            } else if (widPath.widType === 'Graph') {
                if (widPath.bindIO === 'Output 0') {
                    widElem.dataBinding = "App.expController.listOut0";
                } else if (widPath.bindIO === 'Output 1') {
                    widElem.dataBinding = "App.expController.listOut1";
                } else if (widPath.bindIO === 'Output 2') {
                    widElem.dataBinding = "App.expController.listOut2";
                }

                widElem.debugInConsole = 0;
            } else if (widPath.widType === 'Cam') {
                widElem.valueBinding = 'App.expController.camera';
            } else if (widPath.widType === 'Meter') {
                widElem.valueBinding = 'App.expController.numOut0'
            } else if (widPath.widType === 'Switch') {

            } else if (widPath.widType === 'Dial') {
                
            }
            widArray[i - 3] = JSON.stringify(widElem);
        }
        widArray[0] = "New Schema";

        console.log(JSON.stringify(widArray));

        var authCookie = SC.Cookie.find('SESS');
        var resvMessage = "2";

        SC.Request.postUrl('/rest/api/' + resvMessage)
            .header({
                'Cookie': authCookie.name
            })
            .json()
            .notify(this, this.didSendUI)
            .send(widArray);
    },

    didSendUI: function(response) {
        if (SC.ok(response)) {
            console.log("Hip hip hurray");
        }
    }
});
