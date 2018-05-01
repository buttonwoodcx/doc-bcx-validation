export class NumberValueConverter {
  toView(value) {
    if (typeof value === 'number' &&
       value === value && /* not NaN */
       value !== Infinity &&
       value !== -Infinity) {
      return value.toString();
    }
    return '';
  }

  fromValue(value) {
    try {
      const n = parseInt(value, 10);
      return n;
    } catch (e) {
      return null;
    }
  }
}
