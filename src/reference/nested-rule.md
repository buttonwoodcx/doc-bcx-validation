## Nested rule

<div><code-viewer value="var rule = {
  name: ['mandatory', {validate: /^[A-Z]/, message: 'must start with capital letter'}],
  age: ['notMandatory', {validate: 'number', min: 16}]
};

validation.validate({name: '', age: 18}, rule);
// => { name: [ 'must not be empty' ] }

validation.validate({name: 'bob'}, rule);
// => { name: [ 'must start with capital letter' ] }

validation.validate({name: 'Bob', age: 12}, rule);
// => { age: [ 'must be at least 16' ] }

validation.validate({name: 'bob', age: 12}, rule);
// => { name: [ 'must start with capital letter' ], age: [ 'must be at least 16' ] }" mode="js"></code-viewer></div>

As expected, the result is nested too.

Since a nested rule is considered a rule, you can put it in a chain.

<div><code-viewer value="validation.validate({name: 'bob', age: 12}, [rule]);
// => { name: [ 'must start with capital letter' ], age: [ 'must be at least 16' ] }" mode="js"></code-viewer></div>

### Chain multiple nested rule together, `bcx-validation` takes care of merging result

<div><code-viewer value="validation.validate({name: '', age: 12}, [
  {
    name: ['mandatory'] // {name: 'mandatory'} without array wrapper works too
  },
  {
    name: ['mandatory', {validate: /^[A-Z]/, message: 'must start with capital letter'}],
    age: ['notMandatory', {validate: 'number', min: 16}]
  }
]);
// => { name: [ 'must not be empty' ], age: [ 'must be at least 16' ] }" mode="js"></code-viewer></div>

> Note `bcx-validation` avoided the duplication of error message "must not be empty" on property "name".

> The chain of nested rule looks odd. But imaging in your app, you have validation rules contributed by two or more sub-systems, instead of merging validation rule together, you can just stack them as a chain, `bcx-validation` will make sure the result is perfectly merged without any duplication.

Let's move on to [transformer rule](#/reference/transformer-rule).
