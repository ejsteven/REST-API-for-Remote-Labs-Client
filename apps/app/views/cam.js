// ==========================================================================
// Project:   App.Cam
// Copyright: ©2011 Centre for Educational Innovation and Technology
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

App.Cam = SC.View.extend(
/** @scope App.Cam.prototype */ {

    init: function() {
        sc_super();

        this.set('refreshTimer', SC.Timer.schedule({
            target: this,
            action: 'updateImageFeed',
            interval: 250,
            repeats: YES
            //   until: Date.now() + 100000
        }));

        this.set('value', 'http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi');

        this.layoutRel();
    },

    updateImageFeed: function() {
        var currDate = new Date();
        var timeStamp = currDate.getTime();
        var timeStampedURL = 'http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi?' + timeStamp;

        //SC.imageCache.reloadImage('http://foyercam.itee.uq.edu.au/axis-cgi/jpg/image.cgi');

        SC.imageCache.loadImage(timeStampedURL, this, this.imageDidLoad, false);
    },

    imageDidLoad: function(imageUrl, imageOrError) {
        var prevImageURL = this.get('prevImageURL');
        if (prevImageURL !== null) {
            SC.imageCache.releaseImage(prevImageURL, this, this.imageDidRelease);
        }

        this.set('value', imageUrl);
        this.set('prevImageURL', imageUrl);

        console.log(imageUrl);
    },

    imageDidRelease: function(imageUrl, imageOrError) {
        this.set('prevImageURL', '');
    },

    classNames: ['rounded-corners'],
    widType: 'Cam',

    childViews: 'widgetView'.w(),

    layout: {
        left:     0,
        top:      0,
        width:  170,
        height: 170
    },

    isActive: NO,
    displayProperties: ['isActive', 'layout', 'value'],
    backgroundColor: '#E4E4E4',
    bindIO: 'None',
    //useImageCache: 'NO',
    value: '',
    prevImageURL: '',
    //valueBind: 'App.expController.camera',

    layoutRel: function() {
        this.widgetView.adjust('width', parseInt(this.get('layout').width) - 20);
        this.widgetView.adjust('height', parseInt(this.get('layout').height) - 20);
        return YES;
    }.observes('layout'),

    widgetView: SC.ImageView.extend({
        layout: {
            left:    10,
            top:     10,
            width:  150,
            height: 150
        },
        valueBinding: '.parentView.value'
    }),

    mouseDown: function(evt) {
        var numWid = App.adminToolsPage.designerContainer.get('childViews').length;
        var viewTypeBind = App.designerController.get('viewTypeBind');
        var widType = this.get('widType');
        var layout = this.get('layout');
        var i = 0;
        var dataDesc = [];
        var expAPI, apiQuery;

        for (i = 4; i < numWid; i++) {
            if (App.adminToolsPage.designerContainer.get('childViews')[i] === this)
                App.designerController.set('widSelected', i);
        }

        App.designerController.set('isMoving', true);
        console.log(App.designerController.get('isMoving'));

        this._mouseDownInfo = {
            left: layout.left,
            top: layout.top,
            pageX: evt.pageX,
            pageY: evt.pageY
        };

        apiQuery = SC.Query.local(App.ExpApi, 'ioType = " "');
        expAPI = App.store.find(apiQuery);
        dataDesc = expAPI.getEach('dataDesc');

        for (i = 0; i < dataDesc.length; i++) {
            dataDesc[i] = {dataDesc: dataDesc[i]};
        }

        dataDesc.unshift({dataDesc: 'None'});

        if (App.designerController.get('showWidgets') === YES) {
            App.designerController.propertiesPane.contentView.topField.set('value', String(layout.top));
            App.designerController.propertiesPane.contentView.leftField.set('value', String(layout.left));
            App.designerController.propertiesPane.contentView.heightField.set('value', String(layout.height));
            App.designerController.propertiesPane.contentView.widthField.set('value', String(layout.width));

            App.designerController.propertiesPane.contentView.minimumLabel.set('isVisible', false);
            App.designerController.propertiesPane.contentView.minimumField.set('isVisible', false);
            App.designerController.propertiesPane.contentView.maximumLabel.set('isVisible', false);
            App.designerController.propertiesPane.contentView.maximumField.set('isVisible', false);
            App.designerController.propertiesPane.contentView.stepLabel.set('isVisible', false);
            App.designerController.propertiesPane.contentView.stepField.set('isVisible', false);

            App.designerController.propertiesPane.contentView.bindingSelField.set('value', this.get('bindIO'));
            App.designerController.propertiesPane.contentView.bindingSelField.set('objects', dataDesc);
        }

        // Set all widgets back to default background colour and inactive
        for (i = 4; i < numWid; i++) {
            App.adminToolsPage.designerContainer.get('childViews')[i].set('backgroundColor', '#E4E4E4');
            App.adminToolsPage.designerContainer.get('childViews')[i].set('isActive', NO);
        }

        // Highlight the currently selected widget by changing to a unique colour and set as active
        this.set('isActive', YES);
        this.set('backgroundColor', '#254981');

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

        if (App.designerController.get('showWidgets') === YES) {
            App.designerController.propertiesPane.contentView.topField.set('value', String(top));
            App.designerController.propertiesPane.contentView.leftField.set('value', String(left));
        }

        return YES;
    },

    mouseUp: function(evt) {
        this.mouseDragged(evt);
        this._mouseDownInfo = null;

        App.designerController.set('isMoving', NO);
        console.log(App.designerController.get('isMoving'));

        return YES;
    }

});
