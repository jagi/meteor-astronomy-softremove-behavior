import { Match } from "meteor/check";
import { Module } from "meteor/jagi:astronomy";
import documentSoftRestore from "../utils/documentSoftRestore";
const isRemote = Module.modules.storage.utils.isRemote;
const callMeteorMethod = Module.modules.storage.utils.callMeteorMethod;

const softRestore = function(args = {}, callback) {
  let doc = this;
  let Class = doc.constructor;

  // If the first argument is callback function then reassign values.
  if (arguments.length === 1 && Match.test(args, Function)) {
    callback = args;
    args = {};
  }
  // Get variables from the first argument.
  let { simulation = true } = args;

  // If we are dealing with a remote collection and we are not on the server.
  if (isRemote(Class)) {
    // Prepare meteor method name to be called.
    let methodName = "/Astronomy/softRestore";
    // Prepare arguments for the meteor method.
    let methodArgs = {
      className: Class.getName(),
      selector: {
        _id: doc._id
      },
      simulation
    };

    try {
      // Run meteor method.
      let result = callMeteorMethod(Class, methodName, [methodArgs], callback);
      // Return result of the meteor method call.
      return result;
    } catch (err) {
      // Catch stub exceptions.
      if (callback) {
        callback(err);
        return null;
      }
      throw err;
    }
  }

  // If we can just remove a document without calling the meteor method. We may
  // be on the server or the collection may be local.
  try {
    // Prepare arguments.
    let methodArgs = {
      doc,
      simulation,
      trusted: true
    };
    let result = documentSoftRestore(methodArgs);
    if (callback) {
      callback(undefined, result);
    }
    return result;
  } catch (err) {
    if (callback) {
      callback(err);
      return null;
    }
    throw err;
  }
};

export default softRestore;
