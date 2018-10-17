import {inject, computedFrom} from 'aurelia-framework';
import Validation from 'bcx-validation';
import {getterThrottle} from 'aurelia-getter-throttle';
import fakeSave from '../../utils/fake-save';

@inject(Validation)
export class SimpleForm {
  triedSubmit = false;
  isSaving = false;
  users = [
    {type: 'dealer', id: '#0', name: 'Bob', phone: ''}
  ];

  typeOptions = [
    {value: 'dealer', label: 'Dealer'},
    {value: 'customer', label: 'Customer'}
  ]

  constructor(validation) {
    // demo customise validator
    validation.addValidator('phone', {
      validate: /^\d{4,10}$/, message: 'not a valid phone number'
    });

    this.validate = validation.generateValidator({
      key: 'id', // use expression to customise key in foreach errors
      foreach: [
        // chain of rules
        { // no switch, this is a common rule for all users
          name: ['mandatory', 'unique'],
          // id and type would not fail, as they are not free editable
          id: ['mandatory', 'unique'],
          type: ['mandatory', {validate: 'within', items: ['dealer', 'customer']}]
        },
        { // switch on different rule for dealer and customer
          switch: 'type', // use expression
          cases: {
            dealer: {
              phone: [
                {validate: 'mandatory', message: 'mandatory for dealer'},
                'phone'
              ]
            },
            customer: {
              phone: ['notMandatory', 'phone']
            }
          }
        }
      ]
    });
  }

  addUser() {
    this.users.push({
      type: 'customer',
      id: '#' + this.users.length,
      name: '',
      phone: ''
    });
  }

  removeUser(id) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users.splice(idx, 1);
    }
  }

  // dirty check.
  // using getterThrottle is optional.
  // https://github.com/aurelia-contrib/aurelia-getter-throttle
  @getterThrottle()
  get errors() {
    // avoid showing error before first submit
    if (this.triedSubmit) {
      return this.validate(this.users);
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

    fakeSave(this.users).then(
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
