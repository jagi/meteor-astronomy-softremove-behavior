Package.describe({
  name: 'jagi:astronomy-softremove-behavior',
  version: '2.0.6',
  summary: 'Soft remove behavior for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-softremove-behavior.git'
});

Npm.depends({
  lodash: '4.17.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'es5-shim',
    'jagi:astronomy@2.3.4'
  ], ['client', 'server']);

  api.mainModule('lib/main.js', ['client', 'server']);
});