export function each (iterable, callback) {
  let output = '';

  if (iterable instanceof Array) {
    iterable.forEach((item, index) => {
      output += callback(item, index);
    });

  }
  else if (iterable instanceof Object) {
    for (let [key, value] of Object.entries(iterable)) {
      output += callback(value, key);
    }
  }
  return output;
}