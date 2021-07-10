---
layout: default
title: Overview
nav_order: 1
permalink: /guide/overview
parent: In-depth guide
---

# Overview

This guide doesn't talk about Aurelia at all. It's a walk-through of the design of bcx-validation.

---

# bcx-validation

Built by [BUTTONWOODCX](https://buttonwood.com.au), bcx-validation is another validation library to meet our own need.

Why not just use some existing validation tool?

1. most validation tool thinks model is just key-val pairs. We want to validate complex object (a blueprint for cloud deployment). For instance, if cloud provider is AZURE, validates that all vms connected to a load balancer must be within same availablity set, no validation tool on the market is flexible enough to do this.

2. we need to be able to describe validation rule in JSON, as all our business logic is delivered from backend to front-end. (function can still be used in many parts of the rule. Although BUTTONWOODCX mainly uses `bcx-validation`'s expression support, `bcx-validation` itself treats function and expression almost exchangeable.)

3. we just want a light validation tool, a function that takes `model` and `rule` as input, produces a structured `errors` object as output. We don't need a validation tool that bundled with view/controller layer. Binding model to view layer is not even hard in [Aurelia](http://aurelia.io), we don't need the help.

## A quick example

The entry is designed as a class instead of a function, in order to allow user to customise this tool before validating.

```js
import Validation from 'bcx-validation';
const validation = new Validation();
```

The rule.

```js
const rule = {
  name: 'mandatory',
  customers: {
    foreach: {
      email: 'email',
      name: ['mandatory', 'unique'],
      age: [
        'notMandatory',
        {
          validate: 'number',
          'min.bind': 'ageLimit',
           // note message looks like an ES6 string interpolation, but
           // didn't use back-tick `` string, as this string will be
           // interpolated at runtime when validation runs.
           message: '${$parent.name} must be at least ${ageLimit} years old'
        }
      ]
    }
  }
}
```

The model object.

```js
const model = {
  name: 'driver group',
  ageLimit: 21,
  customers: [
    {name: 'Arm', email: 'arm@test.com'},
    {name: 'Bob', email: 'bob@test.com'},
    {name: 'Bob', email: 'bob', age: 15},
    {name: '', age: 18}
  ]
}
```

Validate it.

```js
validation.validate(model, rule);
```

Or generate a function that can be used repeatedly. Following two line do the same thing.

```js
const validate = validation.generateValidator(rule);
validate(model);
```

> `generateValidator` has performance benefit. It pre-compiles the rule for later repeated usage.

Returned `errors` object.

```js
{
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
}
```

Note `customers` in the `errors` object is not an array, it looks like a sparse array but has no `length` property. Here the `key` of every error is the original index of the item, you can use other thing (like customer id) for the `key` in [`foreach`](./foreach-transformer) validator.

In next few chapters, we will show you how to compose a `rule`, from the most basic atomic rule to very complex rule. We will revisit this quick example, to see what happened here.

Let's move on to [basic shape of a rule](./basic-shape-of-a-rule).
