import {inject, observable, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import fakeSave from '../../utils/fake-save';
import {I18N} from 'aurelia-i18n';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Validation, I18N, EventAggregator)
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

  constructor(validation, i18n, ea) {
    this.i18n = i18n;

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
          message: "${i18n.tr('must_be_at_least', {min: 12})}"
        }
      ]
    });
  }

  localeChanged(newLocale) {
    this.i18n.setLocale(newLocale);
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency
  @computedFrom('triedSubmit', 'locale', 'model.name', 'model.age')
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
