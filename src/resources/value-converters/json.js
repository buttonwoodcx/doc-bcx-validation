export class JsonValueConverter {
  toView(value, space) {
    return JSON.stringify(value, null, space);
  }
}
