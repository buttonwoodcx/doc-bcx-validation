## Raw function as rule

Instead of using standard validators provided by `bcx-validation`, you can supply a raw function as validator.

```javascript
const validateLength = value => {
  if (!(value && value.length >= 8)) {
    return "must be at least 8 characters long"
  }
};
```

If value passed your validator, it should return nothing (null/undefined). Otherwise, return a string or array of strings as error message.

```javascript
validation.validate("abc", validateLength);
// => ["must be at least 8 characters long"]
```

> This is not the only way a raw validator can return. It could return a shaped result like `{isValid: false, message: "some error", break: true}` for fine control of chain of validators. We will talk about it more in [chain of rules](#/reference/chain-of-rules).

> A raw validator can also return a boolean. True means pass, false means fail with default error message "invalid". `validation.validate("abc", v => v && v.length >= 8);` => `["invalid"]`.

### Define new validator with function

Raw function validator is rarely used. It doesn't take any of `bcx-validation`'s advantages. For re-usability, it's better to add a new validator.

```javascript
validation.addValidator("atLeast8Chars", value => {
  if (!(value && value.length >= 8)) {
    return "must be at least 8 characters long"
  }
});

validation.validate("abc", {validate: "atLeast8Chars"});
// or
validation.validate("abc", "atLeast8Chars");
// => ["must be at least 8 characters long"]
```

Now you can use value and error message override.

```javascript
validation.validate("name#id_123#mark", {validate: "atLeast8Chars",
                                         value: "_.split($value, '#')[1]",
                                         message: "id must be at least 8 characters long"});
// => ["id must be at least 8 characters long"]
```

You can wrap error message over existing error message.

```javascript
validation.validate("name#id_123#mark", {validate: "atLeast8Chars",
                                         value: "_.split($value, '#')[1]",
                                         message: "id \${_.join($errors, ', ')}"});
// => ["id must be at least 8 characters long"]
```

> `$errors` is a special context variable only within error message override, it represents the original error messages array.

> You might noticed the new validator we defined is quite bad for reuse. It could be better if the min length was passed in as option `{validate: "atLeast", length: 8}`. We will revisit this and show you how to support option in validator function after [validator composition](#/reference/validator-composition).

Let's move on to [chain of rules](#/reference/chain-of-rules).

