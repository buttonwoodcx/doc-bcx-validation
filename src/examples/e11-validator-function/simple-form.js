import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import {getterThrottle} from 'aurelia-getter-throttle';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    label: '',
    phone: ''
  };

  constructor(validation) {
    // same as previous example, but use function instead of composition
    validation.addValidator('australiaPhone', value => {
      // emergency numbers
      if (value.match(/^(000|106|112)$/)) return;

      if (value.startsWith('13')) {
        if (!value.match(/^13(\d{4}|\d{6})$/)) {
          return 'not a valid 13 xx xx number';
        }
      } else if (value.startsWith('1800')) {
        if (!value.match(/^1800\d{6}$/)) {
          return 'not a valid 1800 xxx xxx number';
        }
      } else if (value.startsWith('180') || value.startsWith('188') || value.startsWith('189')) {
        if (!value.match(/^18\d\d{4}$/)) {
          return `not a valid ${value.substr(0, 3)} xxxx number`;
        }
      } else {
        const prefix = value.substr(0, 2);

        if (prefix === '02' || prefix === '03' || prefix === '07' || prefix === '08') {
          if (!value.match(/^\d{10}$/)) {
            return 'not a valid land number';
          }
        } else if (prefix === '04' || prefix === '05') {
          if (!value.match(/^\d{10}$/)) {
            return 'not a valid mobile number';
          }
        } else {
          return 'not a valid number';
        }
      }
    });

    this.validate = validation.generateValidator({
      label: 'mandatory',
      phone: ['mandatory', 'australiaPhone']
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency.
  // using getterThrottle is optional.
  // https://github.com/aurelia-contrib/aurelia-getter-throttle
  @getterThrottle()
  @computedFrom('triedSubmit', 'model.label', 'model.phone')
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
