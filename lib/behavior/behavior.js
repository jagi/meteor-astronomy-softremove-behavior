Astro.createBehavior({
  name: 'softremove',
  options: {
    removedFieldName: 'removed',
    hasRemovedAtField: true,
    removedAtFieldName: 'removedAt'
  },
  events: events
});
