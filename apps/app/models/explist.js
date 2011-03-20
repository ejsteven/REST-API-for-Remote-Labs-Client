// ==========================================================================
// Project:   App.Explist
// Copyright: ©2010 Centre for Educational Innovation and Technology
// ==========================================================================
/*globals App */

/** @class

Model for storing the list of experiments.

  @extends SC.Record
  @version 0.1
*/
App.Explist = SC.Record.extend(
/** @scope Todos.Task.prototype */ {
  expID: SC.Record.attr(Number),
  expName: SC.Record.attr(String),
  expType: SC.Record.attr(String)
}) ;
