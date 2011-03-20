// ==========================================================================
// Project:   App.ExpView
// Copyright: ©2010 Centre of Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

App.ExpView = SC.View.extend(
/** @scope App.ExpView.prototype */ {

    classNames: ['non-selected-exp'],

    contentDisplayProperties: 'expID expName expType'.w(),

    render: function(context, firstTime) {
        var content = this.get('content');
        var expID = content.get('expID');
        var expName = content.get('expName');
        var expType = content.get('expType');

        var picture = 'http://gallery.hd.org/_exhibits/electronics/_more2000' +
                '/_more04/circuit-board-PCB-with-SMT-surface-mount' +
                '-technology-components-including-capacitors-and-resistors' +
                '-and-IC-microchip-1-AJHD.jpg';

        if (expID === 1)
            picture = 'http://farm3.static.flickr.com/2051/1811417036_e2b40dc634_m.jpg';
        else if (expID === 3)
            picture = 'http://www.geekalerts.com/u/usb-micro-new.jpg';

        context = context.begin('div').addClass('exp-bottom-overlay').push('');
        context = context.begin('div').addClass('exp-id').push(expID).end();
        context = context.begin('div').addClass('exp-name').push(expName).end();

        context = context.end();

        if (picture) {
            context = context.begin('div').addClass('exp-background').push('<img src="' +
                      picture + '" class="stretch" alt="" />').end();
        }

        sc_super();
    },

    mouseOver: function() {
        this.$().addClass('selected-exp');
    },

    mouseOut: function() {
        this.$().removeClass('selected-exp');
    }

});
