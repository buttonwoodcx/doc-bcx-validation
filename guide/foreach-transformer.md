---
layout: default
title: Foreach transformer
nav_order: 10
permalink: /guide/foreach-transformer
parent: In-depth guide
---

# foreach transformer

`foreach` is a feature that sets `bcx-validation` apart from other alternatives. It made easy to validate dynamic models.

The [get-started](../get-started) showed an example of `foreach` transformer. It uses item index as the error key, that's default behaviour of `foreach` transformer.

## Error key override

Let's use customer id as the error key, this makes it easier to inspect error object.

```js
var rule = {
  customers: {
    foreach: {
      name: ['mandatory', 'unique'],
      age: ['notMandatory', {validate: 'number', min: 16}],
      id: ['mandatory', 'unique']
    },
    key: 'id'
  }
};

var model = {
  customers: [
    {id: 'aa', name: 'Arm'},
    {id: 'ab', name: 'Bob'},
    {id: 'ab', name: 'Bob', age: 15},
    {id: 'ad', name: '', age: 18}
  ]
};

validation.validate(model, rule);
/* =>
{
  customers: {
    ab: {
      name: ['must be unique'],
      age: ['must be at least 16'],
      id: ['must be unique']
    },
    ad: {
      name: ['must not be empty']
    }
  }
}
*/
```

> Note since the id "ab" is not unique, the error only appears once. If you don't use `key: "id"` error key override, the error will appears twice, one on "1", another on "2".

> key can use either expression or function.

## Special context variables introduced by foreach

Underneath, for every item in the model array, `foreach` transformer creates new [contextual proxy](https://github.com/3cp/contextual-proxy) and add few special context variables.

> Similar to what aurelia repeater does in html template.

For example, when `foreach` is validating property "name" of the first item `{id: 'aa', name: 'Arm'}`, it has following context variables.

```js
{
  $value: 'Arm'
  $propertyPath: ['name']
  $this: {id: 'aa', name: 'Arm'}
  $parent: {customers: [ /* all 4 */ ]}

  // introduced by foreach
  $neighbours: [{id: 'ab', name: 'Bob'}, {id: 'ab', name: 'Bob', age: 15}, {id: 'ad', name: '', age: 18}]
  $neighbourValues: ['Bob', 'Bob', '']
  $index: 0
  $first: true
  $last: false
}
```

> `$propertyPath` is an array of property names, it can have multiple items (like `['address', 'line1']`) if it's a deep nested validation. Internally, we use it as lodash property path. You may wonder why we pick the complex array form `['address', 'line1']`, not the simple dot notation form `'address.line1'`. Lodash supports both forms, but for some property name like "x.y", dot notation doesn't work (`a.x.y` does not mean `a["x.y"]`).

> `$this` is the new context created by foreach, which is the current item.

> `$parent` is the outer/parent context.

> `$neighbours` are all the siblings, BUT DO NOT INCLUDE $this itself.

> `$neighbourValues` are the relevant property values on $neighbours, they are same as `_.map($neighbours, _.property($propertyPath))` when $propertyPath is not empty. When $propertyPath is empty (explained later in "Use foreach to validate simple array"), $neighbourValues are same as $neighbours.

> `$index`, `$first`, `$last` are for the position of current item. They are similar to what aurelia repeater provides.

> For people with aurelia experience, note we don't have $even, $odd context variables in foreach. We don't provide them to avoid conflict with our standard "number" validator which supports $even/$odd options.

Let's have a look how we defined standard "unique" validator.

```js
// copied from standard-validators.js
// unique. need to access neighbours
// option items is evaluated from current scope
validation.addValidator('unique', {validate: 'notIn', 'items.bind': '$neighbourValues', message: 'must be unique'});
```

"unique" validator reuses "notIn" validator, and use $neighbourValues in "notIn"'s "items" option.

> This is a good example of using "option.bind". In validator composition, use "bind" to pass runtime information to underneath validators.

Let's do another exercise around foreach context variables. Let's validate, that in a group of people, there are only certain maximum number of leaders.

```js
validation.addValidator('maxLeader', {
  if: '$this.leader',
  validate: 'number',
  value: '_($neighbours).filter({leader: true}).size()',
  'max.bind': '$max - 1',
  message: 'Only maximum ${$max} leaders allowed'
});
```

We reuse "number" validator, when current person is a leader, checks the count of all neighbour leaders, the number can not exceed (max - 1).

> Note that we didn't check $max option, it assumes the option is mandatory. For safety, you can use `if: "$this.leader && $max > 0"`.

> Note we didn't use $value or $propertyPath in any of the expressions. This means our "maxLeader" validator can be applied to any property of a person. We will elaborate this in examples.

> We passed ($max - 1) to underneath "number" validator's "max" option. This is not the only way to write "maxLeader", you can also do `{validate: "isTrue", value: "_($neighbours).filter({leader: true}).size() <= ($max - 1)"}`.

Let's try out our "maxLeader" validator.

```js
var validate2Leaders = validation.generateValidator({
  foreach: {
    name: ['mandatory', 'unique'],
    leader: {validate: 'maxLeader', max: 2}
  }
});

validate2Leaders([
  {name: 'A', leader: true},
  {name: 'B', leader: true},
  {name: 'C', leader: true},
  {name: 'D'},
]);
/* =>
{ '0': { leader: [ 'Only maximum 2 leaders allowed' ] },
  '1': { leader: [ 'Only maximum 2 leaders allowed' ] },
  '2': { leader: [ 'Only maximum 2 leaders allowed' ] } }
*/

validate2Leaders([
  {name: 'A', leader: true},
  {name: 'B', leader: true},
  {name: 'C'},
  {name: 'D'},
]);
// => undefined
```

Because the way we design "maxLeader", we can use it on other property instead of "leader" property.

```js
var validate2LeadersOnNameProperty = validation.generateValidator({
  foreach: {
    name: ['mandatory', 'unique', {validate: 'maxLeader', max: 2}],
  }
});

validate2LeadersOnNameProperty([
  {name: 'A', leader: true},
  {name: 'B', leader: true},
  {name: 'C', leader: true},
  {name: 'D'},
]);
/* =>
{ '0': { name: [ 'Only maximum 2 leaders allowed' ] },
  '1': { name: [ 'Only maximum 2 leaders allowed' ] },
  '2': { name: [ 'Only maximum 2 leaders allowed' ] } }
*/
```

Let's show you another version of "maxLeader". This time, assume it's validating "leader" property.

```js
validation.addValidator('maxLeader', {
  if: '$value', // current item.leader value
  validate: 'number',
  value: '_($neighbourValues).compact().size()', // _.compact removes false leader
  'max.bind': '$max - 1',
  message: 'Cannot exceed maximum ${$max} leaders'
});

validate2Leaders([
  {name: 'A', leader: true},
  {name: 'B', leader: true},
  {name: 'C', leader: true},
  {name: 'D'},
]);
/* => validating on 'leader' still works
{ '0': { leader: [ 'Cannot exceed maximum 2 leaders' ] },
  '1': { leader: [ 'Cannot exceed maximum 2 leaders' ] },
  '2': { leader: [ 'Cannot exceed maximum 2 leaders' ] } }
*/

validate2LeadersOnNameProperty([
  {name: 'A', leader: true},
  {name: 'B', leader: true},
  {name: 'C', leader: true},
  {name: 'D'},
]);
/* => validating on 'name', oops, all names are truthy
{ '0': { name: [ 'Cannot exceed maximum 2 leaders' ] },
  '1': { name: [ 'Cannot exceed maximum 2 leaders' ] },
  '2': { name: [ 'Cannot exceed maximum 2 leaders' ] },
  '3': { name: [ 'Cannot exceed maximum 2 leaders' ] } }
*/
```

An example to show `foreach` and `switch` work nicely together.

```js
var rule = {
  users: {
    foreach: {
      switch: 'type',
      cases: {
        customer: {
          email: ['notMandatory', 'email'],
          phone: ['notMandatory', 'unique'],
          name: ['mandatory', 'unique']
        },
        dealer: {
          dealerId: ['mandatory', 'unique'],
          phone: ['mandatory', 'unique'],
          email: ['mandatory', 'email'],
          name: ['mandatory', 'unique']
        }
      }
    },
    key: 'id'
  }
};

var model = {
  users: [
    {id: 'c01', type: 'customer', name: 'Arm', email: 'arm@test.com'},
    {id: 'c02', type: 'customer', name: 'Bob', email: 'bob@test.com'},
    {id: 'c03', type: 'customer', name: 'Bob', email: 'bob'},
    {id: 'd01', type: 'dealer', name: 'Dealer A', email: 'arm@test.com'},
    {id: 'd02', dealerId: 'dealer.b', type: 'dealer', name: 'Dealer B', email: 'on', phone: '02123'},
    {id: 'd03', dealerId: 'dealer.b', type: 'dealer', name: 'Dealer B', email: 'b@test.com', phone: '02123'},
  ]
};

validation.validate(model, rule);
/* =>
{ 'users': {
  'c02': { 'name': ['must be unique'] },
  'c03': { 'email': ['not a valid email'],
           'name': ['must be unique'] },
  'd01': { 'dealerId': ['must not be empty'],
           'phone': ['must not be empty'] },
  'd02': { 'dealerId': ['must be unique'],
           'phone': ['must be unique'],
           'email': ['not a valid email'],
           'name': ['must be unique'] },
  'd03': { 'dealerId': ['must be unique'],
           'phone': ['must be unique'],
           'name': ['must be unique'] } } }
*/
```

Chain rule works under `foreach` too. Following rule works same as previous one.

```js
var rule = {
  users: {
    foreach: [
      // generic rule on every customer/dealer
      {
        name: ['mandatory', 'unique'],
        email: ['notMandatory', 'email'],
        phone: ['notMandatory', 'unique']
      },
      // strict rule on dealer
      {
        switch: 'type',
        cases: {
          dealer: {
            dealerId: ['mandatory', 'unique'],
            phone: ['mandatory', 'unique'],
            email: ['mandatory', 'email'],
          }
        }
      }
    ],
    key: 'id'
  }
};
```

> Note we use rule for "customer" as the first one in chain. Second one only validating "dealer". Since all rules in "dealer" are stricter, the final result generated by `bcx-validation` will be nicely merged.

> The order of the rules doesn't matter here. If you swap the position of generic rule and strict rule, the final result is still same.

## Use foreach to validate simple array

You can use `foreach` to validate simple array (not array of complex object).

```js
validation.validate(['xx', 'ab@test.com', '-xi@ a'], {foreach: 'email'});
// => { '0': [ 'not a valid email' ], '2': [ 'not a valid email' ] }
```
#### Use foreach to validate object

`foreach` is designed to validate array, but you still can use it to validate a normal object. Obviously $index, $first, $last do not make sense in this use case.

```js
validation.validate({meta: {field1: '  ', field2: 'hello'}},
                    {meta: {foreach: 'mandatory'}});
// => { meta: { field1: [ 'must not be empty' ] } }
```

## `foreach` with rule factory function

The last feature of `foreach` is that it treats raw function specially.

We learnt before that a raw function is treated as raw validator implementation. But if it's used under `foreach`, it is treated as rule factory.

> This only applies to top level raw function, either in `{foreach: aRuleFactoryFunc}` or `{foreach: [normalRule, aRuleFactoryFunc, anotherRuleFactoryFunc,...]}`.

> This is designed to provide flexibility in `foreach` when `switch` and `if` is not enough for conditional validation.

> There is trade-off for this flexibility. Because rule factory requires runtime information to build the rule, it cannot be pre-compiled. This means you would not see much performance benefit with `generateValidator`.

The above `foreach` + `switch` example can be rewritten as:

```js
var rule = {
  users: {
    foreach: (user) => {
      switch(user.type) {
        case 'customer':
          return {
            email: ['notMandatory', 'email'],
            phone: ['notMandatory', 'unique'],
            name: ['mandatory', 'unique']
          };
        case 'dealer':
          return {
            dealerId: ['mandatory', 'unique'],
            phone: ['mandatory', 'unique'],
            email: ['mandatory', 'email'],
            name: ['mandatory', 'unique']
          };
      }
    },
    key: 'id'
  }
};
```

Let's move on to [add helper](./add-helper-for-expression).
