# Basic shape of a rule

`bcx-validation` makes zero assumption about your `model` (the stuff you want to validate), it can be any JavaScript object.

A `model` can be simply a String or Number (or even Function or null/undefined). We will start with simplest `model` to show you the simplest usage of `rule`.

Let's use term `validator` for an implementation of executing certain `rule`.

To use `isTrue` `validator`, you write a rule like this:

<div><code-viewer value="{validate: 'isTrue'}" mode="js"></code-viewer></div>

Every `bcx-validation` rule is an object with reserved key `validate`, the value of the key is a string identifying an known `validator` to your validation instance.

> Note `isTrue` validator tests truthy of the value, empty string and number zero are false, but empty array/object are true.

When it fails, it returns an array of error message.

<div><code-viewer value="validation.validate(false, {validate: 'isTrue'})
// => ['must be true']" mode="js"></code-viewer></div>

>  For consistency, even a single error message is wrapped in an array.

When it passes, it returns undefined.

<div><code-viewer value="validation.validate(true, {validate: 'isTrue'})
// => undefined" mode="js"></code-viewer></div>

## Optional value override and message override

Instead of testing the current value, you can override the value before it is being judged.

### Override using expression

<div><code-viewer value="validation.validate('lorem', {validate: 'isTrue', value: '$value.length >= 8'});
// => ['must be true']" mode="js"></code-viewer></div>

The error message is odd, it doesn't reflect our intention, let's overwrite it.

<div><code-viewer value="validation.validate('lorem', {validate: 'isTrue',
                              value: '$value.length >= 8',
                              message: 'must be at least 8 characters long'});
// => ['must be at least 8 characters long']" mode="js"></code-viewer></div>

This looks better.

> `value` and `message` are the other two reserved keys in `bcx-validation` rule, it provides override point for value and error message.

> They are the key features to allow us to do [validator composition](#/reference/validator-composition).

Look back on the value override, `"$value.length >= 8"`, this is processed by [bcx-expression-evaluator](https://github.com/buttonwoodcx/bcx-expression-evaluator), which uses exact same syntax as aurelia-binding provides. For users with some aurelia background, `$this` and `$parent` are special context variables you can use inside the expression. `bcx-validation` introduces more special context variables.

Here `$value` is the first speical context variable that `bcx-validation` makes available to expression. `$value` represents the value ("lorem") being validated.

> Since we have not use any [nested rule](#/reference/nested-rule) here, both `$value` and `$this` means "lorem", you can use `"$this.length >= 8"` for value override, the result will be same. In nested rule usage, `$value` means the value of current property, `$this` means current context (the model has that property). We will explain it later.

### Override using function

In Buttonwoodcx, we mainly use expression. But for most of users, if you don't need expression, you can supply function for value override.

<div><code-viewer value="validation.validate('lorem', {validate: 'isTrue',
                              value: value => value.length >= 8,
                              message: 'must be at least 8 characters long'});
// => ['must be at least 8 characters long']" mode="js"></code-viewer></div>

> You might noticed the function we used for value override is not quite safe, when value is null/undefined, the above code raises exception on `value.length`. The safer way is to do `value => value && value.length >= 8`.

> While you have to be careful to do not provide functions throws exception, `bcx-expression-evaluator` is quite safe, silent most of the time, `"$value.length >= 8"` never throws exception.

> The full list of arguments of that function is `function(value, propertyPath, context, get)`. We only used the first `value` argument here. `propertyPath` and `context` are useful in [nest rule](#/reference/nested-rule), `get` is a function to get arbitrary expression value from current scope. In `bcx-validation`, no matter what you use function for, (to override value, to define raw validator, to provide a rule factory) they all have that same list of arguments, but there are different requirements on return value.

If you are interested on using expression, please read through [bcx-expression-evaluator README](https://github.com/buttonwoodcx/bcx-expression-evaluator).

`bcx-validation` uses [lodash](https://github.com/lodash/lodash) extensively. For convenience, lodash is available as a helper to any expression used in `bcx-validation`. So instead of `"$value.length >= 8"`, you can also write `"_.size($value) >= 8"`.

Let's look back on the message override again, the message you provided is actually evaluated by `bcx-expression-evaluator` in es6 string interpolation mode. `"must be at least 8 characters long"` is actually like es6 `` `must be at least 8 characters long` ``.

It means you can do this:

<div><code-viewer value="validation.validate('lorem', {validate: 'isTrue',
                              value: '$value.length >= 8',
                              message: '&quot;\${$value}&quot; is less than 8 characters long'});
// => ['&quot;lorem&quot; is less than 8 characters long']" mode="js"></code-viewer></div>

You have heard `bcx-validation` treats expression and function almost exchangeable. It means you can do this:

<div><code-viewer value="validation.validate('lorem', {validate: 'isTrue',
                              value: '$value.length >= 8',
                              message: value => `&quot;\${value}&quot; is less than 8 characters long`});
// => ['&quot;lorem&quot; is less than 8 characters long']" mode="js"></code-viewer></div>

### Override using regex

Besides expression and function, you can also use regex in value override.

<div><code-viewer value="validation.validate('abc', {validate: 'isTrue',
                            value: /\d/,
                            message: 'must contain some digits'});
// => ['must contain some digits']" mode="js"></code-viewer></div>

When you use regex, it behaves as value override with function `value => /\d/.test(value)`.

> The reason of specifically supporting regex in value override, is that `bcx-expression-evaluator` doesn't allow regex literal inside expression.

> When use regex in value override, the returned value is either true or false. Use `isTrue` or `isFalse` validator with regex value override.

> `{validate: "isTrue", value: /regex/, message: "..."}` is verbose, `bcx-validation` allows you to write `{validate: /regex/, message: "..."}` or simply `/regex/` (if you don't even want to override error message). These shortcuts are implemented as [transformer](#/reference/transformer-rule).

### Use bare string as alias

When you don't need to override either value or error message. You can use the bare validator name as a short-cut.

<div><code-viewer value="validation.validate(false, 'isTrue')
// => ['must be true']" mode="js"></code-viewer></div>

> In the example showed in [introduction](#/reference/intro), `"email"`, `"mandatory"` etc do not have the full shape of a rule. They are aliases, the full form of `"email"` is still `{validate: "email"}`.

Let's move on to [raw function as rule](#/reference/raw-function-as-rule).

