events = {};

events.createQueryBuilder = function(e) {
  var Class = this;
  var queryBuilder = e.data;

  var behaviorData = Class.getBehavior('softremove');

  var selector = {
    $or: [{}, {}]
  };

  selector.$or[0][behaviorData.removedFieldName] = {
    $exists: false
  };

  selector.$or[1][behaviorData.removedFieldName] = {
    $ne: true
  };

  queryBuilder.selector(selector);
};
