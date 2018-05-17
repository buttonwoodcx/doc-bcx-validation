import environment from './environment';
import Validation from 'bcx-validation';
import {Backend, TCustomAttribute} from 'aurelia-i18n';

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

  aurelia.use.plugin('aurelia-i18n', (instance) => {
    let aliases = ['t', 'i18n'];
    // add aliases for 't' attribute
    TCustomAttribute.configureAliases(aliases);

    // register backend plugin
    instance.i18next.use(Backend.with(aurelia.loader));

    return instance.setup({
      backend: {
        loadPath: '../locales/{{lng}}/{{ns}}.json'
      },
      attributes: aliases,
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });
  });


  aurelia.start().then(() => aurelia.setRoot());
}
