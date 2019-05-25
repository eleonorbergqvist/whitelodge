const serverless = require('serverless-http');
const express = require('express')
const { connectDB } = require('./db');
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

const handler = serverless(app);
module.exports.handler = async (event, context) => {
  try {
    await connectDB();
  } catch (e) {
    console.log("ERROR - Cannot start DB");
    throw(e);
  }

  const result = await handler(event, context);
  return result;
};