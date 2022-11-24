# bughunt-ember-auth-restore-loop

This repo contains a minimal reproduction of a bug that exists in the interaction between `ember-simple-auth` and `firebase`, as implemented in the `ember-cloud-firestore-adapter` addon.

The application has a very basic authentication flow. A login page has pre-populated credentials, which match those of a user in the emulator. Once logged in, the user is redirected to `authenticated.index` and their `displayName` from firebase auth should be visible. Upon logout, the user is redirected to the login page.

In terms of `ember-simple-auth`, this repo includes a custom authenticator. However, it is a copy of the default provided by `ember-cloud-firestore-adapter` but with some logging. Essentially, I believe this highlights an issue for anyone using the default authenticator.

## Steps to reproduce

1. clone the repo
2. `npm install`
3. in individual terminal windows, run each of these commands: `ember serve` and `firebase emulators:start --import=test-data`
4. open a browser and navigate to `http://localhost:4200`, and open your console to view logs
5. repeat step 4 in a second browser tab
6. in the first browser tab, click "Submit" - it will not log you in
7. check the console on the second tab; you will see the following error: `The authenticator "authenticator:test-firebase" rejected to restore the session - invalidating…`
8. return to the first tab and click "Submit" again, and check the console in both tabs; you should see a that the console is logging continuously as the application gets stuck in a loop
9. click the "Logout" link to invalidate the session
