// @flow
'use strict';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// we'll change these lines
import sum from './sum'
app.get('/', (req, res) => {
  const a = parseInt(req.query.a);
  const b = parseInt(req.query.b);
  res.send(`${a} + ${b} = ${sum(a, b)}\n`)
});

app.listen(3001, () => console.log('Listening on port 3001.'));
