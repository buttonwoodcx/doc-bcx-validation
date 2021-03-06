---
layout: default
title: Basic shape of a rule
nav_order: 2
permalink: /guide/basic-shape-of-a-rule
parent: In-depth guide
---

# Basic shape of a rule

`bcx-validation` makes zero assumption about your `model` (the stuff you want to validate), it can be any JavaScript object.

A `model` can be simply a String or Number (or even Function or null/undefined). We will start with simplest `model` to show you the simplest usage of `rule`.

Let's use term `validator` for an implementation of executing certain `rule`.

To use `isTrue` `validator`, you write a rule like this:

```js
{validate: 'isTrue'}
```

Every `bcx-validation` rule is an object with reserved key `validate`, the value of the key is a string identifying a known `validator` to your validation instance.

> Note `isTrue` validator tests truthy of the value, empty string and number zero are false, but empty array/object are true.

When it fails, it returns an array of error message.

```js
validation.validate(false, {validate: 'isTrue'})
// => ['must be true']
```

>  For consistency, even a single error message is wrapped in an array.

When it passes, it returns undefined.

```js
validation.validate(true, {validate: 'isTrue'})
// => undefined
```

## Optional value override and message override

Instead of testing the current value, you can override the value before it is being judged.

### Override using expression

```js
validation.validate('lorem', {validate: 'isTrue', value: '$value.length >= 8'});
// => ['must be true']
```

The error message is odd, it doesn't reflect our intention, let's overwrite it.

```js
validation.validate('lorem', {validate: 'isTrue',
                              value: '$value.length >= 8',
                              message: 'must be at least 8 characters long'});
// => ['must be at least 8 characters long']
```

This looks better.

> `value` and `message` are the other two reserved keys in `bcx-validation` rule, it provides override point for value and error message.

> They are the key features to allow us to do [validator composition](./validator-composition).

Look back on the value override, `"$value.length >= 8"`, this is processed by [scoped-eval](https://github.com/3cp/scoped-eval). For users with some aurelia background, `$this` and `$parent` are special context variables you can use inside the expression. `bcx-validation` introduces more special context variables.

Here `$value` is the first special context variable that `bcx-validation` makes available to expression. `$value` represents the value ("lorem") being validated.

> Since we have not use any [nested rule](./nested-rule) here, both `$value` and `$this` means "lorem", you can use `"$this.length >= 8"` for value override, the result will be same. In nested rule usage, `$value` means the value of current property, `$this` means current context (the model has that property). We will explain it later.

### Override using function

In BUTTONWOODCX, we mainly use expression. But for most of users, if you don't need expression, you can supply function for value override.

```js
validation.validate('lorem', {validate: 'isTrue',
                              value: value => value.length >= 8,
                              message: 'must be at least 8 characters long'});
// => ['must be at least 8 characters long']
```

> You might noticed the function we used for value override is not quite safe, when value is null/undefined, the above code raises exception on `value.length`. The safer way is to do `value => value && value.length >= 8`.

> The full list of arguments of that function is `function(value, propertyPath, context, get)`. We only used the first `value` argument here. `propertyPath` and `context` are useful in [nest rule](./nested-rule), `get` is a function to get arbitrary expression value from current scope. In `bcx-validation`, no matter what you use function for, (to override value, to define raw validator, to provide a rule factory) they all have that same list of arguments, but there are different requirements on return value.

If you are interested on using expression, please read through [scoped-eval README](https://github.com/3cp/scoped-eval).

`bcx-validation` uses [lodash](https://github.com/lodash/lodash) extensively. For convenience, lodash is available as a helper to any expression used in `bcx-validation`. So instead of `"$value.length >= 8"`, you can also write `"_.size($value) >= 8"`.

Let's look back on the message override again, the message you provided is actually evaluated by `scoped-eval` in es6 string interpolation mode. `"must be at least 8 characters long"` is actually like es6 `` `must be at least 8 characters long` ``.

It means you can do this:

```js
validation.validate('lorem', {validate: 'isTrue',
                              value: '$value.length >= 8',
                              message: '"${$value}" is less than 8 characters long'});
// => ['"lorem" is less than 8 characters long']
```

You have heard `bcx-validation` treats expression and function almost exchangeable. It means you can do this:

```js
validation.validate('lorem', {validate: 'isTrue',
                              value: '$value.length >= 8',
                              message: value => `"${value}" is less than 8 characters long`});
// => ['"lorem" is less than 8 characters long']
```

### Override using regex

Besides expression and function, you can also use regex in value override.

```js
validation.validate('abc', {validate: 'isTrue',
                            value: /\d/,
                            message: 'must contain some digits'});
// => ['must contain some digits']
```

When you use regex, it behaves as value override with function `value => /\d/.test(value)`.

> When use regex in value override, the returned value is either true or false. Use `isTrue` or `isFalse` validator with regex value override.

> `{validate: "isTrue", value: /regex/, message: "..."}` is verbose, `bcx-validation` allows you to write `{validate: /regex/, message: "..."}` or simply `/regex/` (if you don't even want to override error message). These shortcuts are implemented as [transformer](./transformer-rule).

### Use bare string as alias

When you don't need to override either value or error message. You can use the bare validator name as a short-cut.

```js
validation.validate(false, 'isTrue')
// => ['must be true']
```

> In the example showed in [get-started](../get-started), `"email"`, `"mandatory"` etc do not have the full shape of a rule. They are aliases, the full form of `"email"` is still `{validate: "email"}`.

Let's move on to [raw function as rule](./raw-function-as-rule).

