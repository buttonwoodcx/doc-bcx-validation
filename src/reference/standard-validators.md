# Standard validators

Readable source code. It's part of [`bcx-validation/src/standard-validators.js`](https://github.com/buttonwoodcx/bcx-validation/blob/master/src/standard-validators.js)

<div><code-viewer value="function isBlank(v) {
  if (_.isNull(v) || _.isUndefined(v) || _.isNaN(v)) return true;
  if (_.isString(v)) {
    if (_.trim(v).length === 0) return true;
  } else if (_.isArray(v) || _.isPlainObject(v)) {
    if (_.isEmpty(v)) return true;
  }
}

// Validators

// validators implemented in functions.

validation.addValidator(&quot;isTrue&quot;, v => v ? null : &quot;must be true&quot;);
validation.addValidator(&quot;isFalse&quot;, v => v ? &quot;must be false&quot; : null);

validation.addValidator(
  &quot;passImmediatelyIf&quot;,
  v => v ?
  // stop the chain if passed
  {isValid: true, break: true} :
  // continue, never fail
  null
);

validation.addValidator(
  &quot;skipImmediatelyIf&quot;,
  v => v ?
  // skip rest if passed
  // isValid is not true, but null
  {isValid: null, break: true} :
  // continue, never fail
  null
);

validation.addValidator(
  &quot;failImmediatelyIf&quot;,
  v => v ?
  // stop the chain if failed
  {isValid: false, break: true} :
  // continue
  null
);

// all other validators are in form of composition.

validation.addValidator(&quot;isBlank&quot;, {validate: &quot;isTrue&quot;, value: isBlank, message: &quot;must be blank&quot;});
validation.addValidator(&quot;notBlank&quot;, {validate: &quot;isFalse&quot;, value: isBlank, message: &quot;must not be blank&quot;});

validation.addValidator(&quot;mandatory&quot;, {validate: &quot;failImmediatelyIf&quot;, value: isBlank, message: &quot;must not be empty&quot;});
validation.addValidator(&quot;notMandatory&quot;, {validate: &quot;skipImmediatelyIf&quot;, value: isBlank});

// {validate: 'number', integer: true, min: 0, max: 10, greaterThan: 0, lessThan: 10, even: true, /* odd: true */}
validation.addValidator(&quot;number&quot;, [
  {validate: &quot;isTrue&quot;, value: v => _.isNumber(v), message: &quot;must be a number&quot;, stopValidationChainIfFail: true},
  // option {integer: true}
  {if: &quot;$integer&quot;, validate: &quot;isTrue&quot;, value: v => _.isInteger(v), message: &quot;must be an integer&quot;, stopValidationChainIfFail: true},
  // option {min: aNumber}
  {if: &quot;_.isNumber($min)&quot;, validate: &quot;isTrue&quot;, value: &quot;$value >= $min&quot;, message: &quot;must be at least \${$min}&quot;},
  // option {greaterThan: aNumber}
  {if: &quot;_.isNumber($greaterThan)&quot;, validate: &quot;isTrue&quot;, value: &quot;$value > $greaterThan&quot;, message: &quot;must be greater than \${$greaterThan}&quot;},
  // option {max: aNumber}
  {if: &quot;_.isNumber($max)&quot;, validate: &quot;isTrue&quot;, value: &quot;$value <= $max&quot;, message: &quot;must be no more than \${$max}&quot;},
  // option {lessThan: aNumber}
  {if: &quot;_.isNumber($lessThan)&quot;, validate: &quot;isTrue&quot;, value: &quot;$value < $lessThan&quot;, message: &quot;must be less than \${$lessThan}&quot;},
  // option {even: true}
  {if: &quot;$even&quot;, validate: &quot;isTrue&quot;, value: v => v % 2 === 0, message: &quot;must be an even number&quot;},
  // option {odd: true}
  {if: &quot;$odd&quot;, validate: &quot;isTrue&quot;, value: v => v % 2 === 1, message: &quot;must be an odd number&quot;}
]);

// {validate: 'string', minLength: 4, maxLength: 8}
validation.addValidator(&quot;string&quot;, [
  {validate: &quot;isTrue&quot;, value: v => _.isString(v), message: &quot;must be a string&quot;, stopValidationChainIfFail: true},
  {if: &quot;$minLength&quot;, validate: &quot;isTrue&quot;, value: &quot;_.size($value) >= $minLength&quot;, message: &quot;must have at least \${$minLength} characters&quot;},
  {if: &quot;$maxLength&quot;, validate: &quot;isTrue&quot;, value: &quot;_.size($value) <= $maxLength&quot;, message: &quot;must be no more than \${$maxLength} characters&quot;}
]);

// {validate: 'within', items: [ ... ]}
validation.addValidator(&quot;within&quot;, {validate: &quot;isTrue&quot;, value: &quot;_.includes($items, $value)&quot;, message: &quot;must be one of \${_.join($items, ', ')}&quot;});

// {validate: 'notIn', items: [ ... ]}
validation.addValidator(&quot;notIn&quot;, {validate: &quot;isFalse&quot;, value: &quot;_.includes($items, $value)&quot;, message: &quot;must not be one of \${_.join($items, ', ')}&quot;});

// {validate: 'contain', item: obj, /* or items: [...] */}
validation.addValidator(&quot;contain&quot;, [
  {if: &quot;$item&quot;, validate: &quot;isTrue&quot;, value: &quot;_.includes($value, $item)&quot;, message: &quot;must contain \${$item}&quot;},
  {if: &quot;$items&quot;, validate: &quot;isBlank&quot;, value: &quot;_.difference($items, $value)&quot;, message: &quot;missing \${_.difference($items, $value).join(', ')}&quot;},
]);

// {validate: 'password', minLength: 4, maxLength: 8, alphabet: true, mixCase: true, digit: true, specialChar: true}
validation.addValidator(&quot;password&quot;, [
  // min/maxLength options would be passed through in scope, do not need explicit passing to string validator
  {validate: 'string'},
  {if: '$alphabet', validate: &quot;isTrue&quot;, value: /[a-z]/i, message: 'must contain alphabet letter'},
  {if: '$mixCase', group: [{validate: &quot;isTrue&quot;, value: /[a-z]/}, {validate: &quot;isTrue&quot;, value: /[A-Z]/}], message: 'must contain both lower case and upper case letters'},
  {if: '$digit', validate: /[0-9]/, message: 'must contain number'},
  {if: '$specialChar', validate: /[!@#$%^&*()\-_=+\[\]{}\\|;:'&quot;,<.>\/?]/, message: 'must contain special character (like !@$%)'},
]);

// email regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
validation.addValidator(&quot;email&quot;, {validate: &quot;isTrue&quot;, value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
           message: &quot;not a valid email&quot;});

// unique. need to access neighbours
// option items is evaluated from current scope
validation.addValidator(&quot;unique&quot;, {validate: &quot;notIn&quot;, &quot;items.bind&quot;: &quot;$neighbourValues&quot;, message: &quot;must be unique&quot;});
" mode="js"></code-viewer></div>