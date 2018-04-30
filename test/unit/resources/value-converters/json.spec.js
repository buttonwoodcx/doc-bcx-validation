import {JsonValueConverter} from '../../../../src/resources/value-converters/json';

const c = new JsonValueConverter();

describe('JsonValueConverter', () => {
  it('do JSON.stringify', () => {
    expect(c.toView([1,2])).toBe('[1,2]');
    expect(c.toView({a:1,b:2})).toBe('{"a":1,"b":2}');
    // JSON.stringify(obj, null, 2);
    expect(c.toView({a:1,b:2}, 2)).toBe((`
{
  "a": 1,
  "b": 2
}
    `).trim());
  });
});
