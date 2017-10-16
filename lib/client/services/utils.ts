export function action<A = string, P = {}>(type: A, payload = {}) {
  return { type, ...payload };
}
