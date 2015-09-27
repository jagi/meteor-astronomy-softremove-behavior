Package.describe({
  summary: 'Soft remove behavior for Meteor Astronomy',
  version: '1.0.0',
  name: 'jagi:astronomy-softremove-behavior',
  git: 'https://github.com/jagi/meteor-astronomy-softremove-behavior.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy@1.0.0');
  api.use('underscore');

  // Behavior.
  api.addFiles('lib/behavior/events.js', ['client', 'server']);
  api.addFiles('lib/behavior/methods.js', ['client', 'server']);
  api.addFiles('lib/behavior/behavior.js', ['client', 'server']);
});
