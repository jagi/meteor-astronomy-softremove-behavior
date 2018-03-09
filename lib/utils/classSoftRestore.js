import { Class as AstroClass, Module } from "meteor/jagi:astronomy";
import documentSoftRestore from "./documentSoftRestore";
const throwIfSelectorIsNotId =
  Module.modules.storage.utils.throwIfSelectorIsNotId;

const classRestore = function(args = {}) {
  let { className, selector, simulation = true, trusted = false } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  // Throw exception if we are trying to perform an operation on more than one
  // document at once and it's not trusted call.
  if (!trusted) {
    throwIfSelectorIsNotId(selector, "softRestore");
  }

  let Class = AstroClass.get(className);
  // Get all documents matching selector.
  let docs = Class.find(selector, {
    disableEvents: true
  });
  // Prepare result of the method execution.
  let result = 0;

  docs.forEach(doc => {
    // Update a document.
    result += documentSoftRestore({
      doc,
      simulation,
      trusted
    });
  });

  return result;
};

export default classRestore;
