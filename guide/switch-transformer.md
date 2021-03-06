---
layout: default
title: Switch transformer
nav_order: 9
permalink: /guide/switch-transformer
parent: In-depth guide
---

# switch transformer

```js
var rule = {
  value: { // following switch is a rule applied to field 'value'
    'switch': 'type',
    'cases': {
      'string': ['mandatory', {validate: 'string', minLength: 4}],
      'number': ['notMandatory', {validate: 'number', min: 10}]
    },
    // default is optional, if no case matches, run default rule
    'default': 'mandatory'
  }
};

validation.validate({value: 'on', type: 'string'}, rule);
// => { value: [ 'must have at least 4 characters' ] }

validation.validate({value: 5, type: 'number'}, rule);
// => { value: [ 'must be at least 10' ] }
```

`switch` transformer can also be used in nested context, it's smart enough to figure out the context. Following rule can produce exact same error.

```js
var rule = { // following switch is a rule in nested context
  'switch': 'type', // type is in nested context now
  'cases': {
    'string': {
      // nested rule
      value: ['mandatory', {validate: 'string', minLength: 4}]
    },
    'number': {
      // nested rule
      value: ['notMandatory', {validate: 'number', min: 10}]
    }
  },
  // default is optional, if no case matches, run default rule
  'default': {
    value: 'mandatory'
  }
};

validation.validate({value: 'on', type: 'string'}, rule);
// => { value: [ 'must have at least 4 characters' ] }

validation.validate({value: 5, type: 'number'}, rule);
// => { value: [ 'must be at least 10' ] }
```

The "switch" key accepts either expression or function. The result of the expression/function must be a string, which is used for "cases" lookup.

> Without `switch` transformer, you still can use multiple "if" conditional rules to do the same thing.

> The only reason for using "readyToUse" mode to implement `switch` transformer, is to smartly support both normal mode and nested mode. If cut off support of nested mode, `switch` transformer can be implemented in normal transformer by simply reusing `if` transformer.

Let's move on to [the foreach transformer](./foreach-transformer).
