---
layout: default
title: Conditional validation
nav_order: 5
permalink: /guide/if-transformer
parent: In-depth guide
---

# Conditional validation (if transformer)
Before we get into composition, let's have a look of conditional validation.

```js
validation.validate('NA', {if: "$value != 'NA'", validate: /id\d+/, message: 'invalid id format'});
// => undefined
validation.validate('xx', {if: "$value != 'NA'", validate: /id\d+/, message: 'invalid id format'});
// => [ 'invalid id format' ]
validation.validate('id23', {if: "$value != 'NA'", validate: /id\d+/, message: 'invalid id format'});
// => undefined
```

> We only support expression in `if` condition check, not function. This is to support an edge case that user really want to validate a property named "if" in the model. We will show example of this edge case in [summary](./summary).

Conditional validation was implemented as `if` transformer. We will explain more in [transformer rule](./transformer-rule).

When `bcx-validation` sees that conditional rule above, it transforms it into:

```js
validation.validate('NA', [
  {validate: 'skipImmediatelyIf', value: "!($value != 'NA')"},
  {validate: /id\d+/, message: 'invalid id format'}
]);
```

You can see we will rarely use `skipImmediatelyIf` directly, `if` transformer does the job, and makes the whole rule short and neat.

`if` transformer can wrap chain of rules too. Here is a rewrite of the previous chain rule.

```js
var rule = {
  if: "$value != 'NA'",
  group: [
    // 'mandatory' validator is almost same as {validate: 'failImmediatelyIf', value: '_.isEmpty($value)', message: 'must not be empty'},
    'mandatory',
    [
      {validate: /[a-z]/, message: 'must contain lower case letter', stopValidationChainIfFail: true},
      {validate: /[A-Z]/, message: 'must contain upper case letter', stopValidationChainIfFail: true},
      {validate: /\d/, message: 'must contain digit'}
    ],
    {validate: /_/, message: 'must contain underscore'}
  ]
};
```

Let's move on to [validator composition](./validator-composition).
