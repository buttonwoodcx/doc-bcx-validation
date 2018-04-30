# Define new validator with composition

In `bcx-validation`'s [standard validators](https://github.com/buttonwoodcx/bcx-validation/blob/master/src/standard-validators.js), only 5 validators are implemented with function. They are `"isTrue"`, `"isFalse"`, `"skipImmediatelyIf"`, `"passImmediatelyIf"` and `"failImmediatelyIf"`. All other validators are implemented with composition.

Composition is the best part of `bcx-validation`.

Even "isFalse" validator can be implemented with composition from "isTrue". Let's replace the standard "isFalse" validator.

```javascript
validation.validate(true, "isFalse"); // => [ 'must be false' ]
validation.addValidator(
  "isFalse",
  {validate: "isTrue", value: "!$value", message: "false is what I want"}
);
validation.validate(true, "isFalse"); // => [ 'false is what I want' ]
```

Value override and error message override still work.

```javascript
validation.validate("hello", {validate: "isFalse", value: "$value.length > 4", message: "cannot be longer than 4 chars"});
[ 'cannot be longer than 4 chars' ]
```

You see we reimplemented "isFalse" validator by reusing "isTrue" validator with value override `"!$value"` and error message override `"false is what I want"`.

> `bcx-validation` implemented the default "isFalse" validator with function instead of composition for slightly better performance. Because "isTrue" and "isFalse" are heavily used by other validators implemented with composition, we want to squeeze the performance little bit.

> with `validation.addValidator(name, composition_or_function)`, if you want, you can replace any of the standard validators.

Let's implement a new validator with composition of chain. Let's call it "myToken".

```javascript
validation.addValidator("myToken", [
  {validate: /[a-z]/, message: "must contain lower case letter", stopValidationChainIfFail: true},
  {validate: /[A-Z]/, message: "must contain upper case letter", stopValidationChainIfFail: true},
  {validate: /\d/, message: "must contain digit"}
]);
validation.validate("a", "myToken");
// => [ 'must contain upper case letter' ]
```

That is the basic form of validator composition, but it would be nicer if it supports flexible options. What about using options to turn on every parts of "myToken" validator.
```javascript
validation.addValidator("myToken", [
  {if: "$lowerCase", validate: /[a-z]/, message: "must contain lower case letter", stopValidationChainIfFail: true},
  {if: "$upperCase",validate: /[A-Z]/, message: "must contain upper case letter", stopValidationChainIfFail: true},
  {if: "$digit", validate: /\d/, message: "must contain digit"}
]);
validation.validate("a", "myToken"); // nothing turned on, checks nothing.
// => undefined
validation.validate("a", {validate: "myToken", upperCase: true, digit: true}); // turned on upperCase and digit
// => [ 'must contain upper case letter' ]
validation.validate("a", {validate: "myToken", digit: true}); // turned on digit
// => [ 'must contain digit' ]
```

> Note when only "digit" option was turned on, the first two rules on lowerCase/upperCase were skipped, not considered failed, so `stopValidationChainIfFail` on them has no effect. Exactly what we want.

If `bcx-validation` sees a unknown key, it treats it as option. For `{validate: "myToken", upperCase: true, digit: true}`, it sees two options: "upperCase" and "digit", creates two special context variable `$upperCase` and `$digit` with their static value (both `true` in this case). That's how you can use them inside `if` condition.

> For `{validate: "myToken", upperCase: true, digit: true}`, option `$lowerCase` was not created by `bcx-validation`, it's an unused option, treated as undefined in expression. `if: "$lowerCase"` still works as expected.

> You can also use those special context variables in value override, message override.

> There is no pre definition required for any option to work.

Let's have a look of the source code for standard "number" validator.

```javascript
// copied from standard-validators.js
// {validate: 'number', integer: true, min: 0, max: 10, greaterThan: 0, lessThan: 10, even: true, /* odd: true */}
validation.addValidator("number", [
  {validate: "isTrue", value: v => _.isNumber(v), message: "must be a number", stopValidationChainIfFail: true},
  // option {integer: true}
  {if: "$integer", validate: "isTrue", value: v => _.isInteger(v), message: "must be an integer", stopValidationChainIfFail: true},
  // option {min: aNumber}
  {if: "_.isNumber($min)", validate: "isTrue", value: "$value >= $min", message: "must be at least \${$min}"},
  // option {greaterThan: aNumber}
  {if: "_.isNumber($greaterThan)", validate: "isTrue", value: "$value > $greaterThan", message: "must be greater than \${$greaterThan}"},
  // option {max: aNumber}
  {if: "_.isNumber($max)", validate: "isTrue", value: "$value <= $max", message: "must be no more than \${$max}"},
  // option {lessThan: aNumber}
  {if: "_.isNumber($lessThan)", validate: "isTrue", value: "$value < $lessThan", message: "must be less than \${$lessThan}"},
  // option {even: true}
  {if: "$even", validate: "isTrue", value: v => v % 2 === 0, message: "must be an even number"},
  // option {odd: true}
  {if: "$odd", validate: "isTrue", value: v => v % 2 === 1, message: "must be an odd number"}
]);
```

It supports 7 optional options, "integer", "min", "max", "greaterThan", "lessThan", "even" and "odd". User can use any combination or none. You might noticed we used some function (not expression) as value override in "number" validator, that's for slightly better performance. But when the value override needs to access option, we use expression, as using function to access option is bit too verbose.

Have a look of all the validators defined in [standard validators](https://github.com/buttonwoodcx/bcx-validation/blob/master/src/standard-validators.js), most of them should be pretty easy to understand now.

We have learnt how to use validator composition to easily use options. Let's revisit the validator "atLeast8Chars" that defined with function. I talked about it would be nicer to support a "length" option instead of fixed condition. Here is how you do it.

```javascript
validation.addValidator("atLeast", (value, propertyPath, context, get) => {
  const length = get("$length") || 8; // default to 8

  if (!(value && value.length >= length)) {
    return `must be at least \${length} characters long`
  }
});

validation.validate("abc", "atLeast");
// => ["must be at least 8 characters long"]
validation.validate("abc", {validate: "atLeast", length: 2});
// => undefined
validation.validate("a", {validate: "atLeast", length: 2});
// => ["must be at least 2 characters long"]
```

Just use the `get` function to retrieve any value out of current scope. Underneath, it evaluates an expression against the current scope.

> With `get("$value")`, `get("$propertyPath")` and `get("$this")`, you can get the same value for first 3 arguments (value, propertyPath and context).

In the example in [introduction](#/reference/intro), there is an interesting usage of option "min" in "number" validator.

```javascript
{validate: "number", "min.bind": "ageLimit", message: "\${$parent.name} must be at least \${ageLimit} years old"}]
```

If you use special option name "min.bind", instead of using string "ageLimit" as static value for option "min", `bcx-validation` will evaluate expression "ageLimit" against current scope, then use the value (21 as defined in parent context) as the option "min"'s value.

> Note that we didn't use parent context explicitly in the expression, "$parent.ageLimit" works same, but since it's not ambiguous, "ageLimit" works just fine. This is an aurelia-binding feature which `bcx-expression-evaluator` borrowed.

> Note in error message override, "$parent.name" is needed since "name" is ambiguous. "name" will be resulted to current customer name.

Let's move on to [nested rule](#/reference/nested-rule).