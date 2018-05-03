export function configure(config) {
  config.globalResources([
    './elements/form-field',
    './value-converters/json',
    './binding-behaviors/number'
  ]);
}
