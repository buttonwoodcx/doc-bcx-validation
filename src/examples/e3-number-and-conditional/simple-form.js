import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    // keep all numbers as js number, not string
    cpu: 1,
    memory: 512,
    disk: 10,
    willHostJava: true
  };

  constructor(validation) {
    this.validate = validation.generateValidator({
      cpu: ['mandatory', {validate: 'number', min: 1, max: 64}],
      memory: [
        'mandatory',
        {
          if: 'willHostJava', // `if` accepts an expression to be evaluated
          validate: 'number',
          min: 2048,
          message: 'are you kidding me, ${$value}MB for Java?! you need at least 2048MB',
          // don't want to show irrelevant double error "must be at least 256"
          stopValidationChainIfFail: true
        },
        {validate: 'number', min: 256, max: 64 * 1024}
      ],
      disk: ['mandatory', {validate: 'number', min: 10, max: 1000}]
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency
  @computedFrom('triedSubmit', 'model.cpu', 'model.memory', 'model.disk', 'model.willHostJava')
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
