---
layout: default
title: Standard transformers
nav_order: 2
permalink: /references/standard-transformers
parent: References
---

# Standard transformers

## [if transformer](../guide/if-transformer), aka conditional validation

## [switch transformer](../guide/switch-transformer)

## [foreach transformer](../guide/foreach-transformer)

## regex transformer (2 forms)

1. transform `/aRegex/` into `{validate: 'isTrue', value: /aRegex/, message: 'invalid format'}`
2. transform `{validate: /aRegex/}` into `{validate: 'isTrue', value: /aRegex/, message: 'invalid format'}`

Note the main advantage of form #2 is that it allows you override error message (but you cannot do value override) `{validate: /aRegex/, message: 'not acceptable!'}`.

> Technically, the transformer doesn't know about message override. Message override is later processed in [`bcx-validation/src/standard-validator-wrap.js`](https://github.com/buttonwoodcx/bcx-validation/blob/master/src/standard-validator-wrap.js).
