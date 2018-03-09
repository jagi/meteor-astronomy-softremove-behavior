import { Event } from "meteor/jagi:astronomy";

const triggerAfterSoftRemove = function(doc, trusted) {
  // Trigger the "afterSoftRemove" event handlers.
  doc.dispatchEvent(
    new Event("afterSoftRemove", {
      propagates: true,
      trusted: trusted
    })
  );
};

export default triggerAfterSoftRemove;
