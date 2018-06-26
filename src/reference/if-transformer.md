# Conditional validation (if transformer)
Before we get into composition, let's have a look of conditional validation.

<div><code-viewer value="validation.validate('NA', {if: &quot;$value != 'NA'&quot;, validate: /id\d+/, message: 'invalid id format'});
// => undefined
validation.validate('xx', {if: &quot;$value != 'NA'&quot;, validate: /id\d+/, message: 'invalid id format'});
// => [ 'invalid id format' ]
validation.validate('id23', {if: &quot;$value != 'NA'&quot;, validate: /id\d+/, message: 'invalid id format'});
// => undefined" mode="js"></code-viewer></div>

> We only support expression in `if` condition check, not function. This is to support an edge case that user really want to validate a property named "if" in the model. We will show example of this edge case in [summary](#/reference/summary).

Conditional validation was implemented as `if` transformer. We will explain more in [transformer rule](#/reference/transformer-rule).

When `bcx-validation` sees that conditional rule above, it transforms it into:

<div><code-viewer value="validation.validate('NA', [
  {validate: 'skipImmediatelyIf', value: &quot;!($value != 'NA')&quot;},
  {validate: /id\d+/, message: 'invalid id format'}
]);" mode="js"></code-viewer></div>

You can see we will rarely use `skipImmediatelyIf` directly, `if` transformer does the job, and makes the whole rule short and neat.

`if` transformer can wrap chain of rules too. Here is a rewrite of the previous chain rule.

<div><code-viewer value="var rule = {
  if: &quot;$value != 'NA'&quot;,
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
};" mode="js"></code-viewer></div>

Let's move on to [validator composition](#/reference/validator-composition).
