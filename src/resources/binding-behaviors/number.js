// Number binding-behavior
// enforce number format, maintain source model as a number,
// but maintain target model as string.
//
// usage:
//    <input value.bind="someNumber & number:{allowNegative: true, integerOnly: true}">
//
// support 2 optional options
//    allowNegative (default false)
//    integerOnly (default false)
export class NumberBindingBehavior {
  bind(binding, scope, options = {}) {
    if (!binding.updateSource || !binding.updateTarget) {
      throw new Error('leftClick binding behavior only supports two-way binding.');
    }

    binding.originalUpdateSource = binding.updateSource;
    binding.originalUpdateTarget = binding.updateTarget;

    binding.options = options;
    binding.updateSource = _updateSource;
    binding.updateTarget = _updateTarget;
  }

  unbind(binding, source) {
    binding.updateSource = binding.originalUpdateSource;
    binding.updateTarget = binding.originalUpdateTarget;
    delete binding.options;
    delete binding.targetNumber;
    delete binding.originalUpdateSource;
    delete binding.originalUpdateTarget;
  }
}

function _updateSource(str) {
  const value = str ? str.trim() : '';
  let chars = [];

  for (let i = 0, len = value.length; i < len; i += 1) {
    const c = value[i];
    // scientific (exponential) notation is not supported
    if ((c >= '0' && c <= '9') ||
        (this.options.allowNegative && c === '-' && i === 0 ) ||
        (!this.options.integerOnly && c === '.' && value.indexOf('.') === i /* only one dot */)) {
      chars.push(c);
    }
  }

  const cleanValue = chars.join('');

  // force re-rendering to remove invalid chars.
  // this is the reason we use binding behaviour, not value converter.
  if (str !== cleanValue) {
    this.originalUpdateTarget(cleanValue);
  }

  let number = parseFloat(cleanValue);
  number = Number.isFinite(number) ? number : null;
  this.targetNumber = number;
  this.originalUpdateSource(number);
}

function _updateTarget(number) {
  let str = Number.isFinite(number) ? number.toString() : '';
  if (number !== this.targetNumber) {
    // only update target when number value differs
    // in order to keep leading 0 (like '012') in target
    this.originalUpdateTarget(str);
  }
}
