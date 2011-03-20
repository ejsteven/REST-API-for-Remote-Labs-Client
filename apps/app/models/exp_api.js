// ==========================================================================
// Project:   App.ExpApi
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals App */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
App.ExpApi = SC.Record.extend(
/** @scope App.ExpApi.prototype */ {
  urlExt: SC.Record.attr(String),
  ioType: SC.Record.attr(String),
  dataDesc: SC.Record.attr(String),
  dataType: SC.Record.attr(String),
  rangeMin: SC.Record.attr(Number),
  rangeMax: SC.Record.attr(Number),
  dataSet: SC.Record.attr(Array)
});
