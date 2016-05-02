import { Module } from 'meteor/jagi:astronomy';
import documentSoftRemove from '../utils/document_soft_remove.js';
const wrapCallback = Module.modules.storage.utils.wrapCallback;

function softRemove(args = {}, callback) {
  let doc = this;
  let Class = doc.constructor;
  let Collection = Class.getCollection();
  let connection = Collection._connection;

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  }
  // Get variables from the first argument.
  let {
    simulation = true
  } = args;
  // Wrap callback function.
  let wrappedCallback = wrapCallback(callback);

  // If we are dealing with a remote collection and we are not on the server.
  if (connection && connection !== Meteor.server) {

    // Prepare meteor method name to be called.
    let methodName = '/Astronomy/softRemove';
    // Prepare arguments for the meteor method.
    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation
    };
    // Prepare meteor method options.
    let methodOptions = {
      throwStubExceptions: true,
      returnStubValue: true
    };

    try {
      // Run meteor method.
      let result = connection.apply(
        methodName, [methodArgs], methodOptions, wrappedCallback
      );
      // Return result of the meteor method call.
      return result;
    }
    // Catch stub exceptions.
    catch (error) {
      wrappedCallback(error);
    }

  }
  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  else {

    try {
      // Prepare arguments.
      let methodArgs = {
        doc,
        simulation,
        trusted: true
      };
      return wrappedCallback(
        undefined,
        documentSoftRemove(methodArgs)
      );
    }
    catch (error) {
      wrappedCallback(error);
    }

  }
};

export default softRemove;
