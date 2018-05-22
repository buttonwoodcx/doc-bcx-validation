import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import {getterThrottle} from 'aurelia-getter-throttle';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    name: 'Bob',
    age: null
  };

  constructor(validation) {
    // bcx-validation doesn't support error level error/warning/info.
    // just use separate validation functions to deal with errors and warnings.
    this.validate = validation.generateValidator({
      name: 'mandatory',
      age: 'mandatory'
    });

    this.warningValidate = validation.generateValidator({
      // use notMandatory to avoid unnecessary warning message
      name: ['notMandatory', {validate: 'number', value: '$value.length', min: 4, message: '"${$value}" is too short'}],
      age: ['notMandatory', {validate: 'number', min: 12}]
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency.
  // using getterThrottle is optional.
  // https://github.com/huochunpeng/aurelia-getter-throttle
  @getterThrottle()
  @computedFrom('triedSubmit', 'model.name', 'model.age')
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

  @computedFrom('triedSubmit', 'model.name', 'model.age')
  get warnings() {
    // avoid showing error before first submit
    if (this.triedSubmit) {
      return this.warningValidate(this.model);
    }
  }

  @computedFrom('warnings')
  get hasWarning() {
    return !!this.warnings;
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
