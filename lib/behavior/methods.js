methods = {};

methods.softRemove = function(callback) {
  // Get collection for given class or parent class.
  var Collection = this.constructor.getCollection();
  if (!Collection) {
    throw new Error('There is no collection to remove from');
  }

  // Remove only when document has _id, so it's saved in the collection.
  if (!this._values._id) {
    return;
  }

  // Find a class on which the behavior had been set.
  var behaviorData = Astro.utils.behaviors.findBehavior(this.constructor, 'softremove');

  // We can only soft remove document once.
  var result;
  if (this.get(behaviorData.removedFieldName) !== true) {
    // Trigger the "beforeSoftRemove" event handlers on the current and parent
    // classes.
    var event = new Astro.Event('beforeSoftRemove');
    event.target = this;
    this.constructor.emitEvent(event);

    // Set the "removed" field to true to inform that document had been removed.
    this.set(behaviorData.removedFieldName, true);
    // If the "hasRemovedAtField" option is set.
    if (behaviorData.hasRemovedAtField) {
      // Set remove date.
      this.set(behaviorData.removedAtFieldName, new Date());
    }

    // We do a normal save since we use the events for updating the proper
    // attributes
    result = this.save(callback);

    // Trigger the "afterSoftRemove" event handlers on the current and parent
    // classes.
    event = new Astro.Event('afterSoftRemove');
    event.target = this;
    this.constructor.emitEvent(event);
  }

  // Return result of removing document.
  return result;
};
