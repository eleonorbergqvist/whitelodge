const serverless = require('serverless-http');
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql');
const { connectDB } = require('./db');
const { mergedSchema } = require("./schemas");

const app = express()

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (_req, res) {
  res.send('Hello World!')
})

app.get('/create-fixtures', (_req, res) => {
  const models = require("./models");

  [
    { userName: "johndoe", firstName: "John", lastName: "Doe" },
    { userName: "janedoe", firstName: "Jane", lastName: "Doe" },
  ].map(x => new models.User(x).save());

  res.send("created fixtures");
});

app.use('/graphql', graphqlHTTP({
  schema: mergedSchema,
  graphiql: true
}));

const handler = serverless(app);
module.exports.handler = async (event, context) => {
  await connectDB();
  return await handler(event, context)
};
