// ==========================================================================
// Project:   App.DragSwitch
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

A view which includes two containers and a draggable element to represent a
two-way switch. The state of the switch change once the element has been
dropped into the container.

  @extends SC.View
*/
//App.RED_BOX_DRAG_TYPE = 'red-box-drag-type';

App.DragSwitch = SC.View.extend(SC.DragSource, SC.DragDataSource,
/** @scope App.DragSwitch.prototype */ {

    classNames: 'switch',

    thth: function() {
        console.log('layout did change');
    }.observes('layout'),

    // begin a drag session when the mouse is pressed down on a red view
    mouseDown: function(evt) {
        this.parentView.parentView.set('inSwitch', true);
        var dv = this.constructor.create({
            layout: this.get('layout'),
            parentView: this
        });

        dv.set('layer', this.get('layer').cloneNode(true));

        // initiate the drag
        SC.Drag.start({
            event: evt,
            source: this,
            dragView: dv,
            ghost: YES,
            slideBack: YES,
            dataSource: this
        });

        return YES;
    },

    mouseUp: function(evt) {
        this.parentView.parentView.set('inSwitch', false);
        return YES;
    },

    dragSourceOperationMaskFor: function(dropTarget, drag) {
        // console.log('dragSourceOperationMaskFor called on %@'.fmt(this)) ;
        return SC.DRAG_ANY ;
    },

    //  dragDataTypes: [App.RED_BOX_DRAG_TYPE],

    dragDataForType: function(dataType, drag) {
        console.log('dragDataForType called on %@'.fmt(this)) ;
        return null;
    }

});
