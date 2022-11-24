import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class AuthenticatedIndexController extends Controller {
  @service session;
}
