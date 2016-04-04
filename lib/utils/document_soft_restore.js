import { Module } from 'meteor/jagi:astronomy';
import triggerBeforeSoftRestore from './trigger_before_soft_restore.js';
import triggerAfterSoftRestore from './trigger_after_soft_restore.js';
const isEnvironment = Module.modules.core.utils.isEnvironment;

function documentSoftRestore(args = {}) {
  const {
    doc,
    environment,
    trusted = false
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  const Class = doc.constructor;
  const Collection = Class.getCollection();

  // Restore only when document has the "_id" field (it's persisted).
  if (doc._isNew || !doc._id) {
    return 0;
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