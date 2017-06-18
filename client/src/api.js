export function sum(a, b) {
  return fetch(`/sum?a=${a}&b=${b}`)
  .then(result => result.text())
  .catch(e => console.log(e))
}
