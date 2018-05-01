import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  model = {
    name: '',
    email: '',
    agreeTerm: false,
    address: {
      line1: '',
      line2: '',
      suburb: '',
      state: '',
      postcode: ''
    },
    phoneNumbers: [
      {label: 'Home', value: ''}
    ]
  };

  phoneNumberTypes = ['Home', 'Mobile', 'Office']
  auStates = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

  constructor(validation) {
    this.validate = validation.generateValidator({
      name: 'mandatory',
      // 'notMandatory' can support optional field with additional rule
      email: ['notMandatory', 'email'],
      agreeTerm: {
        validate: 'isTrue',
        message: 'you must to agree our term before continue'
      },
      address: { // nested rule
        line1: 'mandatory',
        // line2: 'notMandatory', // this line is noop.
        suburb: 'mandatory',
        state: {
          validate: 'within',
          items: ['ACT', 'NSW'],
          message: 'sorry, we do not support bussiness outside of ACT and NSW yet'
        },
        postcode: ['mandatory', {validate: /^\d{4}$/, message: 'not valid postcode'}]
      },
      phoneNumbers: {
        foreach: { // foreach transformer
          label: ['mandatory', 'unique'],
          value: ['mandatory', {validate: /^\d{4,}$/, message: 'not valid phone number'}]
        }
      }
    });
  }

  // use dirty check as model is quite complex.
  // dirty check is not a sin.
  get errors() {
    // don't show err on empty form before user tries submit
    if (this.triedSubmit) {
      return this.validate(this.model);
    }
  }

  @computedFrom('errors')
  get hasError() {
    return !!this.errors;
  }

  addPhoneNumber() {
    this.model.phoneNumbers.push({label: 'Home', value: ''});
  }

  removePhoneNumber(index) {
    this.model.phoneNumbers.splice(index, 1);
  }

  save() {
    if (this.isSaving) return;
    this.triedSubmit = true;
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
