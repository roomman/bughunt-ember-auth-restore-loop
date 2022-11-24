import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

import { signInWithEmailAndPassword } from 'ember-cloud-firestore-adapter/firebase/auth';

export default class LoginController extends Controller {
  @tracked email = 'simon@mysolomon.co.uk';
  @tracked password = 'password';

  @service session;

  @action
  async login(e) {
    debugger;
    e.preventDefault();
    await this.session.authenticate('authenticator:firebase', (auth) => {
      return signInWithEmailAndPassword(auth, this.email, this.password);
    });
    debugger;
  }
}
