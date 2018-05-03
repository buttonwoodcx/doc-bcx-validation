import {bindable, bindingMode} from 'aurelia-framework';

// A shared <form-field> tag for all rest examples
export class FormField {
  @bindable label = '';
  @bindable placeholder = '';
  @bindable type = 'string'; // support boolean, string, text, number, and text
  @bindable({defaultBindingMode: bindingMode.twoWay}) value;
  @bindable errors;
  @bindable options; // for type = 'select'
  @bindable integerOnly = false; // for type = 'number'
  @bindable allowNegative = false; // for type = 'number'
}
