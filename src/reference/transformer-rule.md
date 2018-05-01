## Transformer rule

`bcx-validation` uses transformer to simplify the shape of the rule. You will rarely need to define a new transformer. But if you understand it, a new type of transformer can provide you maximum flexibility.

We have learnt `if` transformer in conditional validation. Let's define a new `ifNot` transformer by reusing `if` transformer.

<div><code-viewer value="const ifNotTester = rule => (rule && _.isString(rule.ifNot) && !_.isEmpty(_.omit(rule, 'ifNot')));

validation.addTransformer(
  ifNotTester,
  rule => {
    const {ifNot, ...others} = rule;
    return {if: `!(\${ifNot})`, ...others};
  }
);" mode="js"></code-viewer></div>

The first argument for addTransformer is a tester function, it tests whether a rule can be processed by `ifNot` transformer. You would like to design the tester as defensive as possible to avoid false hit.

The second argument is the transformer function itself, with the rule as input, return a transformed rule object as output. Here we rewrite the rule with `if` transformer.

> When `bcx-validation` resolves a rule, it recursively expands into understandable validators. Here the output of `ifNot` transformer is another rule need to be transformed by `if` transformer. There is no limit of the depth of the resolution, as long as your transformers/validators design did not end up in infinite loop.

Here is another example of transformer. This is how we support bare regex as validation rule.

<div><code-viewer value="validation.validate('ab', /[A-Z]/); // => ['invalid format']

// the bare regex validator is implemented by following code
// copied from standard-validators.js
// transform regex
validation.addTransformer(
  _.isRegExp,
  rule => ({validate: 'isTrue', value: rule, message: 'invalid format'})
);" mode="js"></code-viewer></div>

In summary, for flexibility, we use transformer to accept rule not matching the shape requirement (`{validate: "validatorName", ...}`). Have a look of all the transformers defined in [standard validators](#/reference/standard-validators), you should able to understand all of them except `switch` and `foreach` transformers.

> When `bcx-validation` resolves a rule, it tests against all transformers before trying any validator implementations. That's how `{if: 'condition', validate: 'isTrue'}` is processed by `if` transformer first. If `bcx-validation` tries validators before transformers, `{if: 'condition', validate: 'isTrue'}` will be wrongly treated as "isTrue" validator with option "if" with static value "condition".

> `switch` and `foreach` transformers are different, they are "readyToUse" transformer. As for now, we would not document how to implement a "readyToUse" transformer, it involves understanding how `bcx-validation` internally uses aurelia-binding scope. We will just document the usage of `switch` and `foreach` transformers, they are quite useful.

Let's move on to [the switch transformer](#/reference/switch-transformer).
