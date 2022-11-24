import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service router;

  redirect(model, transition) {
    if (transition.targetName === 'index') {
      this.router.transitionTo('authenticated.index');
    }
  }
}
