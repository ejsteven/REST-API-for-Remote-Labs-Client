App.Voltage = SC.Record.extend(
/** @scope Todos.Task.prototype */ {
  time: SC.Record.attr(Number),
  dataType: SC.Record.attr(String),
  dataVal: SC.Record.attr(Number)
}) ;
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');