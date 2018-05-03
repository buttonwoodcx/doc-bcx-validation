import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    name: '',
    email: ''
  };

  constructor(validation) {
    this.validate = validation.generateValidator({
      name: 'mandatory', // short-cut of {validate: 'mandatory'}
      // chain of rules, 'mandatory' rule will fail and skip
      // rest of the chain when value is blank.
      // short-cut of [{validate: 'mandatory'}, {validate: 'email'}].
      email: ['mandatory', 'email']
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency
  @computedFrom('triedSubmit', 'model.name', 'model.email')
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
