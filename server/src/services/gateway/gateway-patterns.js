export default async function gateway(options) {

  this.add({ role: 'gateway', path: 'test' }, (msg, reply) => {
    console.log("received", msg.args)
    reply({ hello: 'world' })
  })

  /**
    Initialize the Seneca Web Plugin, which is using Express to receive API
    requests and forward them onto the action handlers defined via .add() above.
  */
  this.add('init:gateway', (msg, reply) => {
    this.act('role:web', {
      routes: {
        //prefix: 'v0',
        pin: 'role:gateway, path:*',
        map: {
          test: {
            GET: true
          }
        }
      }
    }, reply)
  })
}
