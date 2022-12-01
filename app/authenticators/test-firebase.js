import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import {
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  getIdTokenResult,
  signOut,
} from 'ember-cloud-firestore-adapter/firebase/auth';

const auth = getAuth();

function parseCherryPickedUser(user) {
  return {
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    providerId: user.providerId,
    uid: user.uid,
    emailVerified: user.emailVerified,
    isAnonymous: user.isAnonymous,
    providerData: user.providerData,
    refreshToken: user.refreshToken,
    tenantId: user.tenantId,
  };
}

function parseCherryPickedClaims(claims) {
  return {
    email: claims.email,
    name: claims.name,
  };
}

export default class FirebaseAuthenticator extends BaseAuthenticator {
  async scheduleIdTokenResult() {
    console.log('scheduleIdTokenResult');
    const user = await this.getUser();
    if (!user) {
      console.log(
        'no user - are we genuinely logged out or just no user for timing?'
      );
    }
    console.log('authenticator.scheduleIdTokenResult - called', user);
    if (user) {
      const token = await getIdTokenResult(user, true);
      // debugger;
      // only call sessionDataUpdated if the claims have changed
      this.trigger('sessionDataUpdated', {
        user: parseCherryPickedUser(user),
        claims: parseCherryPickedClaims(token.claims),
      });
    }
    // ?
  }

  async getUser() {
    console.log('getUser');
    const auth = getAuth();
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          unsubscribe();
          resolve(user);
        }
        console.log('onAuthStateChanged', user);
      });
    });
  }

  async authenticate(callback) {
    console.log('authenticator.authenticate - called');

    const credential = await callback(auth);

    const token = await getIdTokenResult(credential.user);

    return {
      user: parseCherryPickedUser(credential.user),
      claims: parseCherryPickedClaims(token.claims),
    };
  }

  invalidate() {
    console.log('authenticator.invalidate - called');

    return signOut(auth);
  }

  async restore(data) {
    console.log('restore', data);
    this.scheduleIdTokenResult();
    // setup an authStateChanged listener
    // setup an idTokenChanged listener
    const user = await this.getUser();
    if (user && data) {
      return data;
    }
    return Promise.reject();
  }

  // restore(data) {
  //   return new Promise((resolve, reject) => {
  //     debugger;

  //     console.log('authenticator.restore - called', data);
  //     const auth = getAuth();

  //     const unsubscribe = onAuthStateChanged(
  //       auth,
  //       async (user) => {
  //         console.log('onAuthStateChanged - triggered', user);
  //         unsubscribe();

  //         if (user) {
  //           // if we don't have a user it's because firebase auth can't find a token in localStorage
  //           // see: https://github.com/how-to-firebase/tutorials/blob/master/firebase-authentication/03-implementation.md#onauthstatechanged
  //           // so, `ember-simple-auth` will call `authenticate` and update that localStorage, but firebase hasn't stored it's token yet
  //           // although, the auth status has changed or we wouldn't be in this listener!?
  //           // sorting this only fixes half the problem too - we still need a way to get new claims
  //           // this requires an onIdTokenChanged listener that runs on every token refresh - i.e. doesn't unsubscribe from itself like the listener below
  //           console.log('onAuthStateChanged - user is signed in');
  //           const freshToken = this.scheduleIdTokenResult(user);

  //           resolve({
  //             user: parseCherryPickedUser(user),
  //             claims: freshToken.claims,
  //           });
  //         } else {
  //           console.log('onAuthStateChanged - user is signed out');
  //           // removing this condition prevents the double sign in. I think this only relates to login providers like Google, Facebook, etc.
  //           getRedirectResult(auth)
  //             .then((credential) => {
  //               console.log('getRedirectResult - triggered', credential);
  //               if (credential) {
  //                 resolve({ authUser: credential.user });
  //               } else {
  //                 console.log('getRedirectResult - no credential');
  //                 reject();
  //               }
  //             })
  //             .catch(() => {
  //               console.log('getRedirectResult - error');
  //               reject();
  //             });
  //         }
  //       },
  //       () => {
  //         unsubscribe();
  //         reject();
  //       }
  //     );
  //   });
  // }
}
