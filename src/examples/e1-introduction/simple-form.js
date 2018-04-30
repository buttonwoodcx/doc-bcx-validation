import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedAtLeastOnce = false;
  isSaving = false;
  model = {
    name: '',
    email: ''
  };

  constructor(validation) {
    this.validate = validation.generateValidator({
      name: 'mandatory',
      email: ['mandatory', 'email']
    });
  }

  // we can use computedFrom for efficiency here
  // only because model is very simple
  @computedFrom('triedAtLeastOnce', 'model.name', 'model.email')
  get errors() {
    // don't show err on empty form before user tries submit
    if (this.triedAtLeastOnce) {
      return this.validate(this.model);
    }
  }

  @computedFrom('errors')
  get hasError() {
    return !!this.errors;
  }

  save() {
    if (this.isSaving) return;
    this.triedAtLeastOnce = true;
    if (this.hasError) return;

    this.isSaving = true;

    fakeSave(this.model).then(
      json => {
        this.isSaving = false;
        /* eslint no-alert: 0 */
        alert(json.message);
      },
      err => {
        this.isSaving = false;
      }
    );
  }
}
