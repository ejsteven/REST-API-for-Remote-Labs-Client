// ==========================================================================
// Project:   App.expSelectController
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/

App.expSelectController = SC.ObjectController.create(
/** @scope App.expSelectController.prototype */ {

    // Initialise the first container view to be the experiment selection
    nowShowing: 'selectContainer',
    expJSON:'',
    widget: [],

    //selectIDBinding: 'App.expListController.expID',
    // selectIDBindingDefault: SC.Binding.single(),

    createUIFromJSON: function() {
        var parsed = {};
        var widget = this.get('widget');
        var widJSON = this.get('expJSON').getEach('widJSON');

        for (var i = 0; i < this.get('expJSON').length; i++) {
            parsed = JSON.parse(widJSON[i]);

            parsed.mouseDown = undefined;
            parsed.mouseDrag = undefined;
            parsed.mouseUp = undefined;
            parsed.isDraggable = NO;
            parsed.backgroundColor = '';
            parsed.classNames = ['no-style'];

            if (parsed.widType === 'Slider') {
                widget[i] = App.Slider.create(parsed);
            } else if (parsed.widType === 'Graph') {
                widget[i] = App.Graph.create(parsed);
            } else if (parsed.widType === 'Progress') {
                widget[i] = App.Progress.create(parsed);
            } else if (parsed.widType === 'Cam') {
                widget[i] = App.Cam.create(parsed);
            } else if (parsed.widType === 'Meter') {
                widget[i] = App.Meter.create(parsed);
            } else if (parsed.widType === 'Switch') {
                widget[i] = App.Switch.create(parsed);
            } else if (parsed.widType === 'Dial') {
                widget[i] = App.Dial.create(parsed);
            }

            //widget[i].layoutRel();

            App.expPage.expContainer.appendChild(widget[i]);
        }

        this.set('widget', widget);
    },

    clearUI: function() {
        var widget = this.get('widget');
        for (var i = 0; i < widget.length; i++) {
            App.expPage.expContainer.removeChild(widget[i]);
        }

        this.set('widget', []);
    },

    // Sends experiment ID to the server to connect to request access
    // to experiment apparatus
    getReserve: function() {
        var expID = App.expListController.get('expID');
        var user = App.loginController.get('loginName');

        var resvMessage = user + '/' + expID;
        var authCookie = SC.Cookie.find('SESS');

        //send a reserver request to the server
        SC.Request.getUrl('/rest/reserve/' + resvMessage)
            .header({
                'Cookie': authCookie.name
            })
            .notify(this, this.didReserved)
            .send();
    },

    // Callback function to automatically switch to blank experiment control UI form
    // and dynamically populate it with control and sensor objects
    didReserved: function(response) {
        var data = response.get('body');

        if (SC.ok(response)) {
            if (data === 'Reserved') {
                //var exType = this.get('expType');
                App.schemaController.getUI();
            } else
                alert('Experiment already in use. Please try again later.');
        }
    }
});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');