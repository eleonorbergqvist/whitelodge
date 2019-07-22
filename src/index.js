const serverless = require('serverless-http');
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql');
const db = require('./db');
const { mergedSchema } = require("./schemas");

const app = express()

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (_req, res) => {
  res.send('Hello World!')
});

app.get('/create-fixtures', async (_req, res) => {
  const models = require("./models");

  try {
    await Promise.all([
      {
        userName: "johndoe2",
        email: "john@doe.com",
        firstName: "John",
        lastName: "Doe"
      },
      {
        userName: "janedoe2",
        email: "jane@doe.com",
        firstName: "Jane",
        lastName: "Doe"
      },
    ].map(x => new models.User(x).save()))
  } catch (err) {
    throw err;
  }

  res.send("created fixtures");
});

app.use('/graphql', graphqlHTTP({
  schema: mergedSchema,
  graphiql: true
}));

const appHandler = serverless(app);
const handler = async (event, context) => {
  await db.connectDB();
  return await appHandler(event, context)
};

module.exports = {
  handler,
  app,
}
