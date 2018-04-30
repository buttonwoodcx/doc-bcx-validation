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
        settings: {section: 'Tutorial'},
        moduleId: 'tutorial/intro.html'
      },
      {
        route: 'tutorial/basic', name: 'tutorial/basic',
        title: 'Few basic validators',
        nav: true,
        settings: {section: 'Tutorial'},
        moduleId: 'tutorial/basic.html'
      },
      {
        route: 'reference/intro', name: 'reference/intro',
        title: 'Introduction',
        nav: true,
        settings: {section: 'Reference'},
        moduleId: 'reference/intro.html'
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
