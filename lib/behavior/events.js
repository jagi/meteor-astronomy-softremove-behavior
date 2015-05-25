events = {};

events.createQueryBuilder = function(e) {
  var Class = this;
  var queryBuilder = e.data;

  var behaviorData = Astro.utils.findBehavior(Class, 'softremove');
  if (!behaviorData) {
    return;
  }

  var selector = {};
  selector[behaviorData.removedFieldName] = false;
  queryBuilder.select(selector);
};
