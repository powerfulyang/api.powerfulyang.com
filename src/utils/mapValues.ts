export default function mapValues(obj, map) {
  return Object.keys(obj).reduce(function (o, k) {
    return Object.assign(o, Object.defineProperty({}, k, map(obj[k])));
  }, {});
}
