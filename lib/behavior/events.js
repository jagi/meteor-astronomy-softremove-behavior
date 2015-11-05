events = {};

events.beforeFind = function(e) {
  var Class = this;
  var selector = e.data.selector;

  var classBehavior = Class.getBehavior('softremove');
  var options = classBehavior.options;

  selector[options.removedFieldName] = {
    $ne: true
  };
};
