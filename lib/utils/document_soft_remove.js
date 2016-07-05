import triggerBeforeSoftRemove from './trigger_before_soft_remove.js';
import triggerAfterSoftRemove from './trigger_after_soft_remove.js';

function documentSoftRemove(args = {}) {
  const {
    doc,
    simulation = true,
    trusted = false
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  const Class = doc.constructor;
  const Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (doc._isNew || !doc._id) {
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured('softRemove') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Soft removing from the client is not allowed');
  }

  // Trigger before events.
  triggerBeforeSoftRemove(doc, trusted);

  // Prepare selector.
  const selector = {
    _id: doc._id
  };
  // Prepare modifier.
  const modifier = {
    $set: {}
  };
  const behavior = Class.getBehavior('softremove')[0];
  modifier.$set[behavior.options.removedFieldName] = true;
  if (behavior.options.hasRemovedAtField) {
    modifier.$set[behavior.options.removedAtFieldName] = new Date();
  }
  if (behavior.options.hasRemovedByField) {
    modifier.$set[behavior.options.removedByFieldName] = Meteor.userId();
  }
  // Remove a document.
  const result = Collection._collection.update(selector, modifier);

  // Trigger after events.
  triggerAfterSoftRemove(doc, trusted);

  return result;
};

export default documentSoftRemove;