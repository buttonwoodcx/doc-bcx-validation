# Introduction

This is the old document for `bcx-validation`, it doesn't talk about Aurelia at all. It's a mathematical walk-through of the design.

Depending on whether my writing matching your styles of think, this tutorial may help you to better understand the design.

---

Another validation library to meet our own need.

Why not just use some existing validation tool?

1. most validation tool thinks model is just key-val pairs. We want to validate complex object (a blueprint for cloud deployment). For instance, if cloud provider is AZURE, validates that all vms connected to a load balancer must be within same availablity set, no validation tool on the market is flexible enough to do this.

2. we need to be able to describe validation rule in JSON, as all our business logic is delivered from backend to front-end. (function can still be used in many parts of the rule. Although Buttonwoodcx mainly uses `bcx-validation`'s expression support, `bcx-validation` itself treats function and expression almost exchangeable.)

3. we just want a light validation tool, a function that takes `model` and `rule` as input, produces a structured `error` object as output. We don't need a validation tool that bundled with view/controller layer. Binding model to view layer is not even hard in [Aurelia](http://aurelia.io), we don't need the help.

## A quick example

The entry is designed as a class instead of a function, in order to allow user to customise the tool before validating.

<div><code-viewer value="import Validation from 'bcx-validation';
const validation = new Validation();" mode="js"></code-viewer></div>

The rule.

<div><code-viewer value="const rule = {
  name: 'mandatory',
  customers: {
    foreach: {
      email: 'email',
      name: ['mandatory', 'unique'],
      age: ['notMandatory', {validate: 'number',
                             'min.bind': 'ageLimit',
                             message: '\${$parent.name} must be at least \${ageLimit} years old'}]
    }
  }
}" mode="js"></code-viewer></div>

Notice we use [bcx-expression-evaluator](https://github.com/buttonwoodcx/bcx-expression-evaluator) in `number` validator's `min` option and error `message` override.

The model object.

<div><code-viewer value="const model = {
  name: 'driver group',
  ageLimit: 21,
  customers: [
    {name: 'Arm', email: 'arm@test.com'},
    {name: 'Bob', email: 'bob@test.com'},
    {name: 'Bob', email: 'bob', age: 15},
    {name: '', age: 18}
  ]
}" mode="js"></code-viewer></div>

Validate it.

<div><code-viewer value="validation.validate(model, rule);" mode="js"></code-viewer></div>

Or generate a function that can be used repeatedly. Following two line do the same thing.

<div><code-viewer value="const validate = validation.generateValidator(rule);
validate(model);" mode="js"></code-viewer></div>

> `generateValidator` has performance benefit. It pre-compiles the rule for later repeated usage.

Returned `errors` object.

<div><code-viewer value="{
  customers: {
    '1': {name: ['must be unique']},
    '2': {
      name: ['must be unique'],
      email:['not a valid email'],
      age: ['driver group must be at least 21 years old']
    },
    '3': {
      name: ['must not be empty'],
      email:['not a valid email'],
      age: ['driver group must be at least 21 years old']
    }
  }
}" mode="js"></code-viewer></div>

Note `customers` in the `errors` object is not an array, it looks like a sparse array but has no `length` property. Here the `key` of every error is the original index of the item, you can use other thing (like customer id) for the `key` in [`foreach`](#/reference/foreach-transformer) validator.

In next few chapters, we will show you how to compose a `rule`, from the most basic atomic rule to very complex rule. We will revisit this quick example, to see what happened here.

Let's move on to [basic shape of a rule](#/reference/basic-shape-of-a-rule).
