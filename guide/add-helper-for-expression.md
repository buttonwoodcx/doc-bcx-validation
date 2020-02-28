---
layout: default
title: Add helper for expression
nav_order: 11
permalink: /guide/add-helper-for-expression
parent: In-depth guide
---

# Add helper for expression

`bcx-validation` by default adds lodash as a helper to `bcx-expression-evaluator`, so you can use lodash in all expressions.

You can add your own helper.

```js
validation.addHelper('sum', (a, b) => a + b);

var rule = {
  a: {
    validate: 'isTrue',
    value: 'sum($value, b) > 10',
    message: "sum(${sum($value,b)}) is not more than 10"
  }
};

validation.validate({a: 2, b: 3}, rule);
// => { a: ['sum(5) is not more than 10'] }
```

That was a trivial example. Here is a more useful example.

```js
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

## Shared helper

You can add shared helper for all validation instances to share. This feature is designed to help to pre-config shared helpers for any validation instances across a whole app.

```js
Validation.addHelper('sum', (a, b) => a + b);
// Any instance will get access to 'sum' helper.
const validation = new Validation();

var rule = {
  a: {
    validate: 'isTrue',
    value: 'sum($value, b) > 10',
    message: "sum(${sum($value,b)}) is not more than 10"
  }
};

validation.validate({a: 2, b: 3}, rule);
// => { a: ['sum(5) is not more than 10'] }
```

Next is the [summary](./summary).
