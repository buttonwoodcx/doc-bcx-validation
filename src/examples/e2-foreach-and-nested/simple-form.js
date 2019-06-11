import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import {getterThrottle} from 'aurelia-getter-throttle';
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
        message: 'you have to agree our term before continue'
      },
      address: { // nested rule
        line1: 'mandatory',
        // line2: 'notMandatory', // this line is no-op.
        suburb: 'mandatory',
        state: {
          validate: 'within',
          items: ['ACT', 'NSW'],
          message: 'sorry, at this moment, we do not support business outside of ACT and NSW'
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
  // using getterThrottle is optional.
  // https://github.com/aurelia-contrib/aurelia-getter-throttle
  @getterThrottle()
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
        // eslint-disable-next-line no-alert
        alert(json.message);
      },
      () => {
        this.isSaving = false;
      }
    );
  }
}
