import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import {getterThrottle} from 'aurelia-getter-throttle';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  constructor(validation) {
    this.validate = validation.generateValidator({
      username: ['mandatory', 'email'],
      password: [
        'mandatory',
        // if standard validator "password" doesn't cover your rule,
        // you can customise a new validator.
        // read reference: "validator composition",
        // see examples in "standard validators".
        {
          validate: 'password',
          minLength: 8,
          alphabet: true,
          mixCase: true,
          digit: true,
          specialChar: true
        }
      ],
      confirmPassword: {
        validate: 'isTrue',
        // use value override, reference: "basic shape of a rule"
        value: '$value === password',
        message: 'passwords do not match!'
      }
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency.
  // using getterThrottle is optional.
  // https://github.com/aurelia-contrib/aurelia-getter-throttle
  @getterThrottle()
  @computedFrom('triedSubmit', 'model.username', 'model.password', 'model.confirmPassword')
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
      () => {
        this.isSaving = false;
      }
    );
  }
}
