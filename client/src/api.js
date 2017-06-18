export function sum(a, b) {
  return send(`/sum?a=${a}&b=${b}`)
}

async function send(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = new Error(await res.text())
    return Promise.reject(err)
  }
  return res.text()
}
