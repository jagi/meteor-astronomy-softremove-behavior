methods = {};

methods.softRemove = function(callback) {
  var doc = this;
  var Class = doc.constructor;

  // Get collection for given class or parent class.
  var Collection = Class.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to remove from');
  }

  // Remove only when document has _id, so it's saved in the collection.
  if (!this._id) {
    return;
  }

  // Find a class on which the behavior had been set.
  var behaviorData = Class.getBehavior('softremove');

  // We can only soft remove document once.
  var result;
  if (doc.get(behaviorData.removedFieldName) !== true) {
    // Trigger the "beforeSoftRemove" event handlers on the current and parent
    // classes.
    var event = new Astro.Event('beforeSoftRemove');
    event.target = doc;
    Class.emitEvent(event);

    // Set the "removed" field to true to inform that document had been removed.
    doc.set(behaviorData.removedFieldName, true);
    // If the "hasRemovedAtField" option is set.
    if (behaviorData.hasRemovedAtField) {
      // Set remove date.
      doc.set(behaviorData.removedAtFieldName, new Date());
    }

    // We do a normal save since we use the events for updating the proper
    // attributes
    result = doc.save(callback);

    // Trigger the "afterSoftRemove" event handlers on the current and parent
    // classes.
    event = new Astro.Event('afterSoftRemove');
    event.target = doc;
    Class.emitEvent(event);
  }

  // Return result of removing document.
  return result;
};
