import _ from 'lodash';
import { Module, Behavior, Event } from 'meteor/jagi:astronomy';
import beforeFind from '../class_events/before_find.js';
import softRemove from '../class_prototype_methods/soft_remove.js';
import softRestore from '../class_prototype_methods/soft_restore.js';
import meteorSoftRemove from '../meteor_methods/soft_remove.js';
import meteorSoftRestore from '../meteor_methods/soft_restore.js';
const hasMeteorMethod = Module.modules.storage.utils.hasMeteorMethod;

Behavior.create({
  name: 'softremove',
  options: {
    removedFieldName: 'removed',
    hasRemovedAtField: true,
    removedAtFieldName: 'removedAt'
  },
  createClassDefinition() {
    const behavior = this;

    const definition = {
      fields: {},
      events: {
        beforeFind: _.bind(beforeFind, behavior)
      },
      methods: {
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
        '/Astronomy/softRemove': meteorSoftRemove,
        '/Astronomy/softRestore': meteorSoftRestore
      };
      _.each(meteorMethods, (meteorMethod, methodName) => {
        if (!hasMeteorMethod(connection, methodName)) {
          // Add meteor method.
          connection.methods(_.zipObject([methodName], [meteorMethod]));
        }
      });
    }

    Class.extend(this.createClassDefinition(), ['fields', 'events', 'methods']);
  }
});
