export class App {
  configureRouter(config, router) {
    this.router = router;

    config.title = 'bcx-aurelia-dnd examples';
    config.mapUnknownRoutes('not-found.html');
    config.map([
      {
        route: '',
        redirect: 'intro'
      },
      {
        route: 'intro', name: 'intro',
        title: 'Introduction',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'tutorial/intro.html'
      },
      {
        route: 'tutorial/foreach-and-nested', name: 'tutorial/foreach-and-nested',
        title: 'Foreach and nested',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'examples/e2-foreach-and-nested/index'
      },
      {
        route: 'tutorial/number-and-conditional', name: 'tutorial/number-and-conditional',
        title: 'Number and conditional',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'examples/e3-number-and-conditional/index'
      },
      {
        route: 'tutorial/email-and-password', name: 'tutorial/email-and-password',
        title: 'Email and password',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'examples/e4-email-and-password/index'
      },
      {
        route: 'tutorial/foreach-switch-and-customise', name: 'tutorial/foreach-switch-and-customise',
        title: 'Foreach, switch and customise',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'examples/e5-foreach-switch-and-customise/index'
      },
      {
        route: 'tutorial/foreach-and-conditional', name: 'tutorial/foreach-and-conditional',
        title: 'Foreach and conditional',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'examples/e6-foreach-and-conditional/index'
      },
      {
        route: 'tutorial/wip', name: 'tutorial/wip',
        title: '[WIP]',
        nav: true,
        settings: {section: 'Tutorial by examples'},
        moduleId: 'wip.html'
      },
      {
        route: 'reference/standard-validators', name: 'reference/standard-validators',
        title: 'Standard validators',
        nav: true,
        settings: {section: 'Standard features'},
        moduleId: 'reference/standard-validators.html'
      },
      {
        route: 'reference/standard-transformers', name: 'reference/standard-transformers',
        title: 'Standard transformers',
        nav: true,
        settings: {section: 'Standard features'},
        moduleId: 'reference/standard-transformers.html'
      },
      {
        route: 'reference/overview', name: 'reference/overview',
        title: 'Overview',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/overview.html'
      },
      {
        route: 'reference/basic-shape-of-a-rule', name: 'reference/basic-shape-of-a-rule',
        title: 'Basic shape of a rule',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/basic-shape-of-a-rule.html'
      },
      {
        route: 'reference/raw-function-as-rule', name: 'reference/raw-function-as-rule',
        title: 'Raw function as rule',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/raw-function-as-rule.html'
      },
      {
        route: 'reference/chain-of-rules', name: 'reference/chain-of-rules',
        title: 'Chain of rules',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/chain-of-rules.html'
      },
      {
        route: 'reference/if-transformer', name: 'reference/if-transformer',
        title: 'Conditional validation',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/if-transformer.html'
      },
      {
        route: 'reference/validator-composition', name: 'reference/validator-composition',
        title: 'Validator composition',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/validator-composition.html'
      },
      {
        route: 'reference/nested-rule', name: 'reference/nested-rule',
        title: 'Nested rule',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/nested-rule.html'
      },
      {
        route: 'reference/transformer-rule', name: 'reference/transformer-rule',
        title: 'Transformer rule',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/transformer-rule.html'
      },
      {
        route: 'reference/switch-transformer', name: 'reference/switch-transformer',
        title: 'Switch transformer',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/switch-transformer.html'
      },
      {
        route: 'reference/foreach-transformer', name: 'reference/foreach-transformer',
        title: 'Foreach transformer',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/foreach-transformer.html'
      },
      {
        route: 'reference/add-helper-for-expression', name: 'reference/add-helper-for-expression',
        title: 'Add helper',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/add-helper-for-expression.html'
      }
    ]);
  }
}
