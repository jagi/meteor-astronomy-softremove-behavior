import _bind from "lodash/bind";
import _forEach from "lodash/forEach";
import _zipObject from "lodash/zipObject";
import { Module, Behavior, Event } from "meteor/jagi:astronomy";
import beforeFind from "../class_events/beforeFind";
import softRemove from "../class_prototype_methods/softRemove";
import softRestore from "../class_prototype_methods/softRestore";
import meteorSoftRemove from "../meteor_methods/softRemove";
import meteorSoftRestore from "../meteor_methods/softRestore";
const hasMeteorMethod = Module.modules.storage.utils.hasMeteorMethod;

Behavior.create({
  name: "softremove",
  options: {
    removedFieldName: "removed",
    hasRemovedAtField: true,
    removedAtFieldName: "removedAt"
  },
  createClassDefinition() {
    const behavior = this;

    const definition = {
      fields: {},
      events: {
        beforeFind: _bind(beforeFind, behavior)
      },
      // Fix for Astronomy 2.2.4 where I've changed name of the "methods" module
      // to "helpers" module. I shouldn't do that even when changing property
      // name in schema.
      helpers: {
        softRemove,
        softRestore
      }
    };

    // Add a field storing a removal flag.
    definition.fields[behavior.options.removedFieldName] = {
      type: Boolean,
      default: false
    };

    if (behavior.options.hasRemovedAtField) {
      // Add a field storing a removal date.
      definition.fields[behavior.options.removedAtFieldName] = {
        type: Date,
        optional: true
      };
    }

    return definition;
  },
  apply(Class) {
    const Collection = Class.getCollection();

    // If it's a remote collection then we register methods on the connection
    // object of the collection.
    let connection = Collection._connection;
    if (connection) {
      // Prepare meteor methods to be added.
      let meteorMethods = {
        "/Astronomy/softRemove": meteorSoftRemove,
        "/Astronomy/softRestore": meteorSoftRestore
      };
      _forEach(meteorMethods, (meteorMethod, methodName) => {
        if (!hasMeteorMethod(connection, methodName)) {
          // Add meteor method.
          connection.methods(_zipObject([methodName], [meteorMethod]));
        }
      });
    }

    Class.extend(this.createClassDefinition(), [
      "fields",
      "events",
      "helpers",
      "methods"
    ]);
  }
});
