import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import {
  getAuth,
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
    accessControl: claims.accessControl,
    admin: claims.admin,
    email: claims.email,
    email_verified: claims.email_verified,
    name: claims.name,
    presenterId: claims.presenterId,
    subscription: claims.subscription,
    user_id: claims.user_id,
  };
}

export default class FirebaseAuthenticator extends BaseAuthenticator {
  async authenticate(callback) {
    console.log('authenticator.authenticate - called');

    const credential = await callback(auth);

    const token = await getIdTokenResult(credential.user, true);

    return {
      user: parseCherryPickedUser(credential.user),
      claims: parseCherryPickedClaims(token.claims),
    };
  }

  invalidate() {
    console.log('authenticator.invalidate - called');

    return signOut(auth);
  }

  restore() {
    return new Promise((resolve, reject) => {
      const auth = getAuth();

      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          unsubscribe();

          if (user) {
            const freshToken = await getIdTokenResult(user, true);

            resolve({
              user: parseCherryPickedUser(user),
              claims: parseCherryPickedClaims(freshToken.claims),
            });
          }
        },
        () => {
          unsubscribe();
          reject();
        }
      );
    });
  }
}
