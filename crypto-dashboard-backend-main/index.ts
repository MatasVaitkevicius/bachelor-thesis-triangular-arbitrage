const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const createError = require('http-errors');

import { services } from './services';

mongoose
  .connect('mongodb://127.0.0.1:27017/mydatabase')
  .then((x: any) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err: any) => {
    console.error('Error connecting to mongo', err.reason)
  })

const tokenAPI = require('./routes/token.route')
const trioAPI = require('./routes/trio.route')
const dexAPI = require('./routes/dex.route')

const app = express()

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)

app.use(cors())
app.use('/api', tokenAPI)
app.use('/api', trioAPI)
app.use('/api', dexAPI)
app.use('/api', services);

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})