import environment from './environment';
import Validation from 'bcx-validation';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources')
    .developmentLogging(environment.debug ? 'info' : 'warn')
    .plugin('bcx-doc-base')
    .transient(Validation); // isolate all validation instances

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
