import { Module } from 'meteor/jagi:astronomy';
import triggerBeforeSoftRemove from './trigger_before_soft_remove.js';
import triggerAfterSoftRemove from './trigger_after_soft_remove.js';
const isEnvironment = Module.modules.core.utils.isEnvironment;

function documentSoftRemove(args = {}) {
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

  // Remove only when document has the "_id" field (it's persisted).
  if (doc._isNew || !doc._id) {
    return 0;
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
  // Remove a document.
  const result = Collection._collection.update(selector, modifier);

  // Trigger after events.
  triggerAfterSoftRemove(doc, trusted);

  return result;
};

export default documentSoftRemove;