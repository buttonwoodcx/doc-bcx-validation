import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import {getterThrottle} from 'aurelia-getter-throttle';
import _ from 'lodash';

const fakeSave = (model) => {
  return new Promise((resolve, reject) => {
    const {name} = model;

    setTimeout(() => {
      if (name === 'To Fail') {
        reject({
          errors: {
            name: `"${name}" is reserved`
          }
        });
      } else {
        resolve({message: `Saved ${JSON.stringify(model)}`});
      }
    }, 500);
  });
};

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  backendErrors = null;
  model = {
    name: 'To Fail',
    age: null
  };

  constructor(validation) {
    this.validate = validation.generateValidator({
      name: 'mandatory',
      age: ['mandatory', {validate: 'number', min: 12}]
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

  // not used. but you can use this property to style dom.
  @computedFrom('hasError', 'backendErrors')
  get hasErrorOrBackendError() {
    return this.hasError || !!this.backendErrors;
  }

  save() {
    if (this.isSaving) return;
    this.triedSubmit = true;
    if (this.hasError) return;

    this.isSaving = true;
    this.backendErrors = null;

    fakeSave(this.model).then(
      json => {
        this.isSaving = false;
        // eslint-disable-next-line no-alert
        alert(json.message);
      },
      err => {
        // wrap single error string into an array.
        // you may need different wrapper if your backend error shape differs.
        this.backendErrors = _.mapValues(err.errors, v => [v]);
        this.isSaving = false;
      }
    );
  }
}
