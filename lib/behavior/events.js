events = {};

events.beforeFind = function(e) {
  var Class = this;
  var selector = e.data.selector;

  var behaviorData = Class.getBehavior('softremove');

  selector[behaviorData.removedFieldName] = {
    $ne: true
  };
};
