---
layout: default
title: Standard validators
nav_order: 1
permalink: /references/standard-validators
parent: References
---

# Standard validators (built-in)

It's defined in [`bcx-validation/src/standard-validators.js`](https://github.com/buttonwoodcx/bcx-validation/blob/master/src/standard-validators.js)

The source code is quite readable.

```js
// validators implemented in functions.

validation.addValidator("isTrue", v => v ? null : "must be true");
validation.addValidator("isFalse", v => v ? "must be false" : null);

validation.addValidator(
  "passImmediatelyIf",
  v => v ?
  // stop the chain if passed
  {isValid: true, break: true} :
  // continue, never fail
  null
);

validation.addValidator(
  "skipImmediatelyIf",
  v => v ?
  // skip rest if passed
  // isValid is not true, but null
  {isValid: null, break: true} :
  // continue, never fail
  null
);

validation.addValidator(
  "failImmediatelyIf",
  v => v ?
  // stop the chain if failed
  {isValid: false, break: true} :
  // continue
  null
);

// all other validators are in form of composition.

validation.addValidator("isBlank", {validate: "isTrue", value: isBlank, message: "must be blank"});
validation.addValidator("notBlank", {validate: "isFalse", value: isBlank, message: "must not be blank"});

validation.addValidator("mandatory", {validate: "failImmediatelyIf", value: isBlank, message: "must not be empty"});
validation.addValidator("notMandatory", {validate: "skipImmediatelyIf", value: isBlank});

// {validate: 'number', integer: true, min: 0, max: 10, greaterThan: 0, lessThan: 10, even: true, /* odd: true */}
validation.addValidator("number", [
  {validate: "isTrue", value: v => _.isNumber(v), message: "must be a number", stopValidationChainIfFail: true},
  // option {integer: true}
  {if: "$integer", validate: "isTrue", value: v => _.isInteger(v), message: "must be an integer", stopValidationChainIfFail: true},
  // option {min: aNumber}
  {if: "_.isNumber($min)", validate: "isTrue", value: "$value >= $min", message: "must be at least ${$min}"},
  // option {greaterThan: aNumber}
  {if: "_.isNumber($greaterThan)", validate: "isTrue", value: "$value > $greaterThan", message: "must be greater than ${$greaterThan}"},
  // option {max: aNumber}
  {if: "_.isNumber($max)", validate: "isTrue", value: "$value <= $max", message: "must be no more than ${$max}"},
  // option {lessThan: aNumber}
  {if: "_.isNumber($lessThan)", validate: "isTrue", value: "$value < $lessThan", message: "must be less than ${$lessThan}"},
  // option {even: true}
  {if: "$even", validate: "isTrue", value: v => v % 2 === 0, message: "must be an even number"},
  // option {odd: true}
  {if: "$odd", validate: "isTrue", value: v => v % 2 === 1, message: "must be an odd number"}
]);

// {validate: 'string', minLength: 4, maxLength: 8}
validation.addValidator("string", [
  {validate: "isTrue", value: v => _.isString(v), message: "must be a string", stopValidationChainIfFail: true},
  {if: "$minLength", validate: "isTrue", value: "_.size($value) >= $minLength", message: "must have at least ${$minLength} characters"},
  {if: "$maxLength", validate: "isTrue", value: "_.size($value) <= $maxLength", message: "must be no more than ${$maxLength} characters"}
]);

// {validate: 'within', items: [ ... ], caseInsensitive: true}
validation.addValidator("within", [
  {if: "!$caseInsensitive", validate: "isTrue", value: "_.includes($items, $value)", message: "must be one of ${_.join($items, ', ')}"},
  {if: "$caseInsensitive", validate: "isTrue", value: "_.includes(_.map($items, _.toLower), _.toLower($value))", message: "must be one of ${_.join($items, ', ')}"},
]);

// {validate: 'notIn', items: [ ... ], caseInsensitive: true}
validation.addValidator("notIn", [
  {if: "!$caseInsensitive", validate: "isFalse", value: "_.includes($items, $value)", message: "must not be one of ${_.join($items, ', ')}"},
  {if: "$caseInsensitive", validate: "isFalse", value: "_.includes(_.map($items, _.toLower), _.toLower($value))", message: "must not be one of ${_.join($items, ', ')}"},
]);

// {validate: 'contain', item: obj, /* or items: [...] */}
validation.addValidator("contain", [
  {if: "$item", validate: "isTrue", value: "_.includes($value, $item)", message: "must contain ${$item}"},
  {if: "$items", validate: "isBlank", value: "_.difference($items, $value)", message: "missing ${_.difference($items, $value).join(', ')}"},
]);

// {validate: 'password', minLength: 4, maxLength: 8, alphabet: true, mixCase: true, digit: true, specialChar: true}
validation.addValidator("password", [
  // min/maxLength options would be passed through in scope, do not need explicit passing to string validator
  {validate: 'string'},
  {if: '$alphabet', validate: "isTrue", value: /[a-z]/i, message: 'must contain alphabet letter'},
  {if: '$mixCase', group: [{validate: "isTrue", value: /[a-z]/}, {validate: "isTrue", value: /[A-Z]/}], message: 'must contain both lower case and upper case letters'},
  {if: '$digit', validate: /[0-9]/, message: 'must contain number'},
  {if: '$specialChar', validate: /[!@#$%^&*()\-_=+\[\]{}\\|;:'",<.>\/?]/, message: 'must contain special character (like !@$%)'},
]);

// email regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
// updated to block Intranet email address user@server1 as it's rarely used nowadays
validation.addValidator("email", {validate: "isTrue", value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
           message: "not a valid email"});

// unique. need to access neighbours
// option items is evaluated from current scope
validation.addValidator("unique", {validate: "notIn", "items.bind": "$neighbourValues", message: "must be unique"});

// url, only http and https are supported
// regex based on https://www.ietf.org/rfc/rfc3986.txt
// but limited to just http and https protocol
validation.addValidator("url", [
  {validate: "isFalse", value: /\s/, message: 'not a valid URL, white space must be escaped'},
  {validate: "isTrue", value: /^https?:\/\/[^/?#]+[^?#]*(\?[^#]*)?(#.*)?$/, message: 'not a valid URL'}
]);
```