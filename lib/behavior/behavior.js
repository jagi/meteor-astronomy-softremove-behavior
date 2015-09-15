Astro.createBehavior({
  name: 'softremove',
  options: {
    removedFieldName: 'removed',
    hasRemovedAtField: true,
    removedAtFieldName: 'removedAt'
  },
  createSchemaDefinition: function(options) {
    var schemaDefinition = {
      fields: {},
      events: events,
      methods: methods,
    };

    // Add a field storing a removal flag.
    schemaDefinition.fields[options.removedFieldName] = {
      type: 'boolean',
      default: false
    };

    // Add a field storing a removal date.
    if (options.hasRemovedAtField) {
      schemaDefinition.fields[options.removedAtFieldName] = {
        type: 'date',
        default: null
      };
    }

    return schemaDefinition;
  }
});
