'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'bughunt-ember-auth-restore-loop',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-cloud-firestore-adapter': {
      firebaseConfig: {
        apiKey: 'AIzaSyDvxiOQMKRlAsr2V_8dr-E_boH7i5z8n60',
        authDomain: 'solomon-firebase-testing.firebaseapp.com',
        projectId: 'solomon-firebase-testing',
        storageBucket: 'solomon-firebase-testing.appspot.com',
        messagingSenderId: '427837124089',
        appId: '1:427837124089:web:24399a8fed3c6872046128',
        measurementId: 'G-QVR9F2MQSW',
      },

      firestore: {
        emulator: {
          hostname: 'localhost',
          port: 8080,
        },
      },

      auth: {
        emulator: {
          hostname: 'localhost',
          port: 9099,
        },
      },
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
