import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
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
    validation.addValidator('australiaPhone', [
      // for demo only, incomplete
      {validate: 'passImmediatelyIf', value: /^(000|106|112)$/}, // emergency numbers
      {
        switch: '$value.substr(0,2)',
        cases: {
          '13': {validate: /^13(\d{4}|\d{6})$/, message: 'not a valid 13 xx xx number'},
          '18': [
            {
              if: "$value.startsWith('1800')",
              validate: /^1800\d{6}$/,
              message: 'not a valid 1800 xxx xxx number',
              stopValidationChainIfFail: true,
              stopValidationChainIfPass: true
            },
            {
              if: "$value.startsWith('180') || $value.startsWith('188') || $value.startsWith('189')",
              validate: /^18\d\d{4}$/,
              message: 'not a valid ${$value.substr(0,3)} xxxx number'
            }
          ],
          '02': {validate: /^\d{10}$/, message: 'not a valid land number'},
          '03': {validate: /^\d{10}$/, message: 'not a valid land number'},
          '07': {validate: /^\d{10}$/, message: 'not a valid land number'},
          '08': {validate: /^\d{10}$/, message: 'not a valid land number'},
          '04': {validate: /^\d{10}$/, message: 'not a valid mobile number'},
          '05': {validate: /^\d{10}$/, message: 'not a valid mobile number'}
        },
        default: {
          // if no case matches, always fail
          validate: 'isTrue',
          value: 'false',
          message: 'not a valid number'
        }
      }
    ]);
    this.validate = validation.generateValidator({
      label: 'mandatory',
      phone: ['mandatory', 'australiaPhone']
    });
  }

  // as model is very simple here,
  // we can use computedFrom for efficiency
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
      err => {
        this.isSaving = false;
      }
    );
  }
}
