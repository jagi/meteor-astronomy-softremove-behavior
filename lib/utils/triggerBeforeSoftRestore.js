import { Event } from "meteor/jagi:astronomy";

const triggerBeforeSoftRestore = function(doc, trusted) {
  // Trigger the "beforeSoftRestore" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeSoftRestore", {
        cancelable: true,
        propagates: true,
        trusted: trusted
      })
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeSoftRestore"
    });
  }
};

export default triggerBeforeSoftRestore;
