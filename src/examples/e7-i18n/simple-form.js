import {inject, observable, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import fakeSave from '../../utils/fake-save';
import {I18N} from 'aurelia-i18n';

@inject(Validation, I18N)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    name: '',
    age: null
  };

  @observable locale = 'en';
  localeOptions = [
    {value: 'en', label: 'English'},
    {value: 'fr', label: 'French'}
  ];

  constructor(validation, i18n) {
    this.i18n = i18n;
    this.i18nLocale = this.i18n.getLocale();

    // for validation to use i18n inside expression
    validation.addHelper('i18n', i18n);

    this.validate = validation.generateValidator({
      // bcx-validation doesn't not support i18n natively.
      // here we override all message to be translated.
      // note, use string interpolation to translate at runtime.
      name: {validate: 'mandatory', message: "${i18n.tr('must_not_be_empty')}"},
      age: [
        {validate: 'mandatory', message: "${i18n.tr('must_not_be_empty')}"},
        {
          validate: 'isTrue',
          value: '$value >= 12',
          // you can use function instead of string interpolation.
          // don't need addHelper('i18n', i18n) for this to work.
          message: () => i18n.tr('must_be_at_least', {min: 12})
        }
      ]
    });

    // the above is not the only way to support i18n.
    // since bcx-validation doesn't provide any related feature,
    // you are free to implement however you want.
    //
    // for instance, override error message without using i18n,
    // {message: 'must_not_be_empty'}
    // {message: 'must_be_at_least:12'} // you need some convention to pass parameters
    // then translate those errors into i18n in html template (form-field.html),
    // note you need some code to handle i18n parameters.
  }

  localeChanged(newLocale) {
    this.i18n.setLocale(newLocale).then(() => {
      // wait for i18next properly.
      // errors are depending on this.i18nLocale, not this.locale.
      this.i18nLocale = this.i18n.getLocale();
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency
  @computedFrom('triedSubmit', 'i18nLocale', 'model.name', 'model.age')
  get errors() {
    // avoid showing error before first submit
    if (this.triedSubmit) {
      return this.validate(this.model);
    }
  }

  @computedFrom('errors')
  get hasError() {
    return !!this.errors;
  }

  save() {
    if (this.isSaving) return;
    this.triedSubmit = true;
    if (this.hasError) return;

    this.isSaving = true;

    fakeSave(this.model).then(
      json => {
        this.isSaving = false;
        // eslint-disable-next-line no-alert
        alert(json.message);
      },
      err => {
        this.isSaving = false;
      }
    );
  }
}
