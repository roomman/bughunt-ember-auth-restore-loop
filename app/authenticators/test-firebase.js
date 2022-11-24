import { getOwner } from '@ember/application';

import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import {
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from 'ember-cloud-firestore-adapter/firebase/auth';

export default class FirebaseAuthenticator extends BaseAuthenticator {
  get fastboot() {
    return getOwner(this).lookup('service:fastboot');
  }

  async authenticate(callback) {
    console.log('authenticator.authenticate - called');

    const auth = getAuth();
    const credential = await callback(auth);

    return { user: credential.user };
  }

  invalidate() {
    console.log('authenticator.invalidate - called');

    const auth = getAuth();

    return signOut(auth);
  }

  restore() {
    return new Promise((resolve, reject) => {
      console.log('authenticator.restore - called');

      const auth = getAuth();

      if (
        this.fastboot?.isFastBoot &&
        this.fastboot.request.headers
          .get('Authorization')
          ?.startsWith('Bearer ')
      ) {
        const token = this.fastboot.request.headers
          .get('Authorization')
          ?.split('Bearer ')[1];

        if (token) {
          signInWithCustomToken(auth, token)
            .then((credential) => {
              resolve({ user: credential.user });
            })
            .catch(() => {
              reject();
            });
        } else {
          reject();
        }
      } else {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            console.log(
              'authenticator.restore - `onAuthChanged` triggered',
              JSON.parse(JSON.stringify(user))
            );
            if (unsubscribe) {
              console.log('authenticator.restore - `unsubscribe` called');
            }
            unsubscribe();

            if (user) {
              resolve({ user });
            } else {
              getRedirectResult(auth)
                .then((credential) => {
                  if (credential) {
                    resolve({ user: credential.user });
                  } else {
                    reject();
                  }
                })
                .catch(() => {
                  reject();
                });
            }
          },
          () => {
            reject();
            unsubscribe();
          }
        );
      }
    });
  }
}
