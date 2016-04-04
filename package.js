Package.describe({
  summary: 'Soft remove behavior for Meteor Astronomy',
  version: '2.0.0-rc.1',
  name: 'jagi:astronomy-softremove-behavior',
  git: 'https://github.com/jagi/meteor-astronomy-softremove-behavior.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'es5-shim',
    'jagi:astronomy@2.0.0-rc.8',
    'stevezhu:lodash@4.6.1'
  ], ['client', 'server']);

  api.mainModule('lib/main.js', ['client', 'server']);
});