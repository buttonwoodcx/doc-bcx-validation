# bcx-validation

Alternative way to do validation in Aurelia app, simple and flexible.

Different from official [`aurelia-validation`](https://github.com/aurelia/validation) and almost all other validation libs out there, we have a different naive view on validation.

> Validation is a function that takes `model` (not just key-val pairs) and `rule` as input, produces a structured `errors` (we will see shortly why we use plural) object as output. No more and no less.

Enough talking, let's look at first example.

<compose view-model="../examples/e1-introduction/index"></compose>

I will explain bit more after this first example, I promise you won't see any excessive explanation from next page on.

## bcx-validation is generic, not an Aurelia plugin

The first thing you see from the above simple example is that **`bcx-validation` does not depend on Aurelia**. It's a generic validation tool.

The entry is a class `Validation`, we use class to allow you to customise it (adding helper, and implement new validators) before using it.

To isolate your customisation, it's recommended to register it as transient in Aurelia DI container.

<div><code-viewer value="// in your main.js
import Validation from 'bcx-validation';

export function configure(aurelia) {
  // ...
  aurelia.use.transient(Validation); // or aurelia.container.registerTransient(Validation);
  // ...
}" mode="js"></code-viewer></div>

## Structure of `errors`

Play the above example, you can see a basic structure of the `errors` object,

<div><code-viewer value="{
  &quot;name&quot;: [&quot;must not be empty&quot;],
  &quot;email&quot;: [&quot;must not be empty&quot;]
}" mode="js"></code-viewer></div>

In technical term, the rule in use is a nested rule, the `errors` result is in nested format accordingly.

For every field, for instance `name` field, the `errors` of `name` is an array of failure messages. Here we only have one message, but there could be more errors messages if more validation rules were applied on `name` field.

Next example [foreach-and-nested](#/tutorial/foreach-and-nested) showcases flexibility.
