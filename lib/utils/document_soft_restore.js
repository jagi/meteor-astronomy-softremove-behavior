import triggerBeforeSoftRestore from './trigger_before_soft_restore.js';
import triggerAfterSoftRestore from './trigger_after_soft_restore.js';

function documentSoftRestore(args = {}) {
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

  // Restore only when document has the "_id" field (it's persisted).
  if (doc._isNew || !doc._id) {
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured('softRestore') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Soft restoring from the client is not allowed');
  }

  // Trigger before events.
  triggerBeforeSoftRestore(doc, trusted);

  // Prepare selector.
  const selector = {
    _id: doc._id
  };
  // Prepare modifier.
  const modifier = {
    $set: {}
  };
  const behavior = Class.getBehavior('softremove')[0];
  modifier.$set[behavior.options.removedFieldName] = false;
  if (behavior.options.hasRemovedAtField) {
    modifier.$unset = {
      [behavior.options.removedAtFieldName]: ''
    };
  }
  // Restore a document.
  const result = Collection._collection.update(selector, modifier);

  // Trigger after events.
  triggerAfterSoftRestore(doc, trusted);

  return result;
};

export default documentSoftRestore;