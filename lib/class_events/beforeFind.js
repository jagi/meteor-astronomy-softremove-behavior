const beforeFind = function(e) {
  const doc = e.currentTarget;
  const Class = doc.constructor;
  const selector = e.selector;

  selector[this.options.removedFieldName] = { $ne: true };
};

export default beforeFind;
