import { Module } from "meteor/jagi:astronomy";
import classSoftRemove from "../utils/classSoftRemove";
const wrapCallback = Module.modules.storage.utils.wrapCallback;

const softRemove = function(selector, callback) {
  let Class = this;
  let Collection = Class.getCollection();

  // Prepare arguments.
  let args = {
    className: Class.getName(),
    selector
  };
  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (Collection._connection && Collection._connection !== Meteor.server) {
    // Prepare meteor method name to be called.
    let methodName = "/Astronomy/softRemove";
    // Prepare meteor method options.
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run Meteor method.
      return Collection._connection.apply(
        methodName,
        [args],
        methodOptions,
        wrappedCallback
      );
    } catch (error) {
      // Catch stub exceptions.
      wrappedCallback(error);
    }
  } else {
    // If we can just soft remove a document without calling the meteor method. We may
    // be on the server or the collection may be local.
    try {
      // Set the "trusted" argument to true.
      args.trusted = true;
      // Remove a document.
      return wrappedCallback(undefined, classSoftRemove(args));
    } catch (error) {
      wrappedCallback(error);
    }
  }
};

export default softRemove;
