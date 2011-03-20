// ==========================================================================
// Project:   App.DragSwitchHolder
// Copyright: ©2010 Centre for Educational Innovation and Technology
// Developers: Omar Alkynaley and Steven Chen
// ==========================================================================
/*globals App */

/** @class

  (Document Your View Here)

  @extends SC.View
*/

App.DragSwitchHolder = SC.View.extend(SC.DropTarget,
/** @scope App.DragSwitchHolder.prototype */ {

    classNames: ['switch-holder'],

    dragStarted: function(drag, evt) {
        // console.log('dragStarted called on %@'.fmt(this)) ;
        this.$().addClass('drop-target');
    },

    computeDragOperations: function(drag, evt) {
        return SC.DRAG_ANY ;
    },

    performDragOperation: function(drag, op) {
        this.appendChild(drag.get('source'));
        return op ;
    },

    dragEntered: function(drag, evt) {
        console.log('dragEntered called on %@'.fmt(this)) ;
    },

    dragUpdated: function(drag, evt) {
        // console.log('dragUpdated called on %@'.fmt(this)) ;
    },

    dragExited: function(drag, evt) {
        console.log('dragExited called on %@'.fmt(this)) ;
    },

    dragEnded: function(drag, evt) {
        // console.log('dragEnded called on %@'.fmt(this)) ;
        this.$().removeClass('drop-target');
    }

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');