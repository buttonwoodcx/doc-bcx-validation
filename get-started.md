---
layout: default
title: Get Started
nav_order: 2
permalink: /get-started
---

# Get Started

```bash
npm i bcx-validation
# or yarn add bcx-validation
# or pnpm i bcx-validation
```

## bcx-validation is Generic

**`bcx-validation` is a generic validation tool**. We will show all our tutorial examples in [Aurelia](https://aurelia.io), because Aurelia's dependency injection and two-way binding makes integrating bcx-validation very intuitive without excessive boilerplate.

## First Example

<iframe style="width: 100%; height: 400px; border: 2px solid #343a40; border-radius: 3px;" loading="lazy" src="https://gist.dumber.app/?gist=a48ba81d75bf38457b19b7703ccafa3e&open=src%2Fsimple-form.js&open=src%2Fsimple-form.html"></iframe>

The entry is the `Validation` class.

> The entry is designed as a `class` to allow user to customise (adding helper, implement new validator) before validate.

Because of the customisation, it's better to isolate customisation with a new instance of `Validation` class.

> In Aurelia app, you can isolate customisation by registering `Validation` as "transient" in Aurelia DI container. This is **recommended (but not required)**.

```js
// in your main.js
import Validation from 'bcx-validation';

export function configure(aurelia) {
  // ...

  // Recommended (but not required)
  // transient means Aurelia will create new instance (new Validation())
  // on every dependency injection.
  aurelia.use.transient(Validation);
  // or aurelia.container.registerTransient(Validation);

  // ...
}
```

## Structure of errors

Play the above example, you can see a basic structure of the `errors` object,

```json
{
  "name": ["must not be empty"],
  "email": ["must not be empty"]
}
```

In the technical term, that validation rule in use is a nested rule, the `errors` result is in nested format mapping the rule accordingly.

For every field, for instance `name` field, the `errors` of `name` is an array of failure messages.

> Here we only have one message, but there could be more errors messages if more validation rules were applied on `name` field.

## That was enough talking

Next, drive into the [examples](./examples) for the various features.
