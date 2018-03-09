import { Event } from "meteor/jagi:astronomy";

const triggerBeforeSoftRemove = function(doc, trusted) {
  // Trigger the "beforeSoftRemove" event handlers.
  if (
    !doc.dispatchEvent(
      new Event("beforeSoftRemove", {
        cancelable: true,
        propagates: true,
        trusted: trusted
      })
    )
  ) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error("prevented", "Operation prevented", {
      eventName: "beforeSoftRemove"
    });
  }
};

export default triggerBeforeSoftRemove;
