// ==========================================================================
// Project:   App.DialSelection
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.ImageView
*/
App.DialSelection = SC.ImageView.extend(
/** @scope App.DialSelection.prototype */ {

    selOrient: 0,
    logStateChanges: YES,

    value: sc_static('images/selection3.png'),

    init: function() {
        sc_super();

        this.goTransient();
    },

    goTransient: function() {
        this.set('state', 'transient');

        if (this.logStateChanges)
            console.log(this.get('state'));

        this.goMouseOutMouseUp();
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

    goMouseOutMouseDown: function() {
        this.set('state', 'mouseOutMouseDown');

        if (this.logStateChanges)
            console.log(this.get('state'));
    },

    mouseEntered: function() {
        if (this.get('state') === 'mouseOutMouseDown') {
            this.goMouseOverMouseDown();
        } else if (this.get('state') === 'mouseOutMouseUp') {
            this.goMouseOverMouseUp();
        }
    },

    mouseExited: function() {
        if (this.get('state') === 'mouseOverMouseUp') {
            this.goMouseOutMouseUp();
        } else if (this.get('state') === 'mouseOverMouseDown') {
            this.goMouseOutMouseDown();
        }
    },

    mouseDown: function() {
        if (this.get('state') === 'mouseOverMouseUp') {
            this.goMouseOverMouseDown();
        }
    },

    mouseUp: function() {
        if (this.get('state') === 'mouseOverMouseDown') {
            this.goMouseOverMouseUp();

            var selOrient = this.get('selOrient');
            var idx = 0, newCSS;

         //   console.log(this.parentView.widgetView.classNames);
            //   console.log('dial-' + this.parentView.currDialPos);

            //      if ((idx = this.parentView.widgetView.classNames.indexOf('dial-' + this.parentView.currDialPos)) !== -1) {
            //          this.parentView.widgetView.classNames[idx] = 'dial-' + selOrient;
            //      } else
            //          this.parentView.widgetView.classNames.push('dial-' + selOrient);

            newCSS = this.parentView.getCSSRule('.smooth-turn.dial-rotate');
            newCSS.style.MozTransform = 'rotate(' + selOrient +'deg)';

            var selValue = this.get('selValue');

            console.log('new value = ' + selValue);

            this.parentView.currDialPos = selOrient;

            this.parentView.widgetView.displayDidChange();

        } else if (this.get('state') === 'mouseOutMouseDown') {
            this.goMouseOutMouseUp();
        }
    }
});
