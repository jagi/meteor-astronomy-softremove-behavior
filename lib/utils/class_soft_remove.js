import { Class as AstroClass, Module } from 'meteor/jagi:astronomy';
import documentSoftRemove from './document_soft_remove.js';
const isEnvironment = Module.modules.core.utils.isEnvironment;
const throwIfSelectorIsNotId = Module.modules.storage.utils.throwIfSelectorIsNotId;

function classRemove(args = {}) {
  let {
    className,
    selector,
    environment,
    trusted = false
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.
  if (!trusted) {
    throwIfSelectorIsNotId(selector, 'softRemove');
  }

  let Class = AstroClass.get(className);
  // Get all documents matching selector.
  let docs = Class.find(selector);
  // Prepare result of the method execution.
  let result = 0;

  docs.forEach((doc) => {
    // Update a document.
    result += documentSoftRemove({
      doc,
      environment,
      trusted
    });
  });

  return result;
};

export default classRemove;