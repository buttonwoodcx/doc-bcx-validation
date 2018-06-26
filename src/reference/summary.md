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
