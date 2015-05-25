var checks = {};

checks.behaviorData = function(behaviorData) {
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

Astro.createBehavior({
  name: 'softremove',
  options: {
    removedFieldName: 'removed',
    hasRemovedAtField: true,
    removedAtFieldName: 'removedAt'
  },
  events: {
    addbehavior: function(behaviorData) {
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
      checks.behaviorData.call(Class, behaviorData);

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

      // Add the "createQueryBuilder" event to the class.
      Class.addEvents(events);
    }
  }
});
