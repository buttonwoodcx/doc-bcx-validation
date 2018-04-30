# Add helper for expression

`bcx-validation` by default adds lodash as a helper to `bcx-expression-evaluator`, so you can use lodash in all expressions.

You can add your own helper.

```javascript
validation.addHelper('sum', (a, b) => a + b);

var rule = {
  a: {
    validate: 'isTrue',
    value: 'sum($value, b) > 10',
    message: "sum(\${sum($value,b)}) is not more than 10"
  }
};

validation.validate({a: 2, b: 3}, rule);
// => { a: ["sum(5) is not more than 10"] }
```

That was a trivial example. Here is a more useful example.

```javascript
var model = {
  customers: [
    {id: 'c1', name: 'A', friendIds: ['c3', 'c4']},
    {id: 'c2', name: 'B', friendIds: []},
    {id: 'c3', name: 'C', friendIds: ['c1']},
    {id: 'c4', name: 'D', friendIds: ['c1']},
  ]
};

validation.addHelper('customerOf', (id) => _.find(model.customers, {id}));
```

Then you can use `customerOf(a_id)` in any expression. For instance, on any property of a customer, you can do `"_(friendIds).map(customerOf).map('name').value()"` to get all friends' names for that customer.

That concludes all `bcx-validation` features.

# Summary

Since atomic rule, chain rule, nested rule, and transformers are treated generically as rule, they can be composed together in all sorts of ways.

Most time, `bcx-validation` treats expression and function exchangeable. There are two special cases:

> In `if` transformer, `{if: "conditionExpression"}` only supports expression as condition. This is to avoid ambiguousness. If you want to validate a nested property named "if", you can use `{if: aFunction}` or `{if: {validate: "fullShapeRule"}}` or `{if: ["aliasInChain", ...]}`.

> In `foreach` transformer, top level function is a rule factory, not raw validator.

`bcx-validation`'s rule format is simple and readable, it always tries to understand what you want.

But when validating some property name that's one of `bcx-validation`'s reserved keys, it could be ambiguous. Like validating property named "validate" with "mandatory" validator: `{validate: "mandatory"}` (`bcx-validation` would not see it as your intended nested validation).

> Reserved keys are `validate`, `value`, `message`, `stopValidationChainIfFail`, `stopValidationChainIfPass`. Plus `if`, `switch`, `foreach`, `key`, introduced by standard transformers.

The easy way to avoid ambiguousness is to use either full shape, or wrap it in a chain, `{validate: {validate: "mandatory"}}` or `{validate: ["mandatory"]}`. This works for all our reserved keys.

> Note `foreach` and `key` works in a pair. Either they are recognised as `foreach` transformer as a whole, or recognised as nested validation on property "foreach" and "key".

Happy validating!