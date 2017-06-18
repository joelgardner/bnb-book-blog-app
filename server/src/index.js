// @flow
'use strict';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// we'll change this line
app.get('/', (req, res) => res.send('Hello Worxld'));

app.listen(3001, () => console.log('Listening on port 3001.'));
