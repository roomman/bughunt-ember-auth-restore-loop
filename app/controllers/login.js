import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

import { signInWithEmailAndPassword } from 'ember-cloud-firestore-adapter/firebase/auth';

export default class LoginController extends Controller {
  @tracked email = 'test@solomoncrm.com';
  @tracked password = 'password';

  @service session;

  @action
  async login(e) {
    e.preventDefault();
    await this.session.authenticate('authenticator:test-firebase', (auth) => {
      return signInWithEmailAndPassword(auth, this.email, this.password);
    });
  }
}
