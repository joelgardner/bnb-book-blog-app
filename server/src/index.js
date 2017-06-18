// @flow
'use strict'
import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// we'll change these lines
import sum from './sum'
app.get('/sum', (req, res) => {
  const { a, b } = req.query
  res.status(200).send(sum(+a, +b).toString())   // coerce a and b into integers with +
})

app.listen(3001, () => {
  /* eslint-disable no-console */
  console.log('Listening on port 3001.')
  /* eslint-enable no-console */
})
