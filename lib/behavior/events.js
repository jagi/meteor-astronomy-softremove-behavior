events = {};

events.createQueryBuilder = function(e) {
  var Class = this;
  var queryBuilder = e.data;

  var behaviorData = Astro.utils.findBehavior(Class, 'softremove');

  var selector = {};
  selector[behaviorData.removedFieldName] = {
    $ne: true
  };
  queryBuilder.select(selector);
};
