import { Event } from 'meteor/jagi:astronomy';

function triggerAfterSoftRestore(doc, trusted) {
	// Trigger the "afterSoftRestore" event handlers.
	doc.dispatchEvent(new Event('afterSoftRestore', {
		propagates: true,
		trusted: trusted
	}));
};

export default triggerAfterSoftRestore;