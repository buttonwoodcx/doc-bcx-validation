## Nested rule

```javascript
var rule = {
  name: ["mandatory", {validate: /^[A-Z]/, message: "must start with capital letter"}],
  age: ["notMandatory", {validate: "number", min: 16}]
};

validation.validate({name: "", age: 18}, rule);
// => { name: [ 'must not be empty' ] }

validation.validate({name: "bob"}, rule);
// => { name: [ 'must start with capital letter' ] }

validation.validate({name: "Bob", age: 12}, rule);
// => { age: [ 'must be at least 16' ] }

validation.validate({name: "bob", age: 12}, rule);
// => { name: [ 'must start with capital letter' ], age: [ 'must be at least 16' ] }
```

As expected, the result is nested too.

Since a nested rule is considered a rule, you can put it in a chain.

```javascript
validation.validate({name: "bob", age: 12}, [rule]);
// => { name: [ 'must start with capital letter' ], age: [ 'must be at least 16' ] }
```

You can chain two nested rule together, `bcx-validation` takes care of merging result.

```javascript
validation.validate({name: "", age: 12}, [
  {
    name: ["mandatory"]
  },
  {
    name: ["mandatory", {validate: /^[A-Z]/, message: "must start with capital letter"}],
    age: ["notMandatory", {validate: "number", min: 16}]
  }
]);
// => { name: [ 'must not be empty' ], age: [ 'must be at least 16' ] }
```

> Note `bcx-validation` avoided the duplication of error message "must not be empty" on property "name".

> The chain of nested rule looks odd. But imaging in your app, you have validation rules contributed by two or more sub-systems, instead of merging validation rule together, you can just stack them as a chain, `bcx-validation` will make sure the result is perfectly merged without any duplication.

Let's move on to [transformer rule](#/reference/transformer-rule).
