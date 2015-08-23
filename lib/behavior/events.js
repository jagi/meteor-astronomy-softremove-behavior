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

var checkBehaviorData = function(behaviorData) {
  if (!_.isString(behaviorData.removedFieldName)) {
    throw new Error(
      'The "removedFieldName" option in the "softremove" behavior has to ' +
      'be a string'
    );
  }

  if (!_.isBoolean(behaviorData.hasRemovedAtField)) {
    throw new Error(
      'The "hasRemovedAtField" option in the "softremove" behavior has to ' +
      'be a boolean'
    );
  }

  if (!_.isString(behaviorData.removedAtFieldName)) {
    throw new Error(
      'The "removedAtFieldName" option in the "softremove" behavior has to ' +
      'be a string'
    );
  }
};

events.addBehavior = function(behaviorData) {
  var Class = this;
  var behavior = Astro.behaviors.softremove;

  // Set default behavior's options if they were not provided in the schema.
  if (_.isUndefined(behaviorData.removedFieldName)) {
    behaviorData.removedFieldName = behavior.options.removedFieldName;
  }
  if (_.isUndefined(behaviorData.hasRemovedAtField)) {
    behaviorData.hasRemovedAtField = behavior.options.hasRemovedAtField;
  }
  if (_.isUndefined(behaviorData.removedAtFieldName)) {
    behaviorData.removedAtFieldName = behavior.options.removedAtFieldName;
  }

  // Check validity of options.
  checkBehaviorData.call(Class, behaviorData);

  // Add fields.
  Class.addField(behaviorData.removedFieldName, {
    type: 'boolean',
    default: false
  });
  if (behaviorData.hasRemovedAtField) {
    Class.addField(behaviorData.removedAtFieldName, {
      type: 'date',
      default: null
    });
  }

  // Add method.
  Class.addMethods(methods);
};
