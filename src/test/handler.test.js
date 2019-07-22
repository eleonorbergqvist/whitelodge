const request = require("supertest");
const models = require("../models");
const { app } = require("../index");
const testHelper = require("./testHelper");

beforeAll(() => testHelper.startDB());
afterAll(() => testHelper.stopDB());
afterEach(() => testHelper.cleanupDB());

test("that root endpoints return proper result", async () => {
  const res = await request(app).get("/");

  expect(res.statusCode).toBe(200);
  expect(res.text).toBe("Hello World!");
});

test("that fixture endpoint sets up stub items", async () => {
  const res = await request(app).get("/create-fixtures");

  expect(res.statusCode).toBe(200);
  expect(res.text).toBe("created fixtures");

  const count = await models.User.count().exec();
  expect(count).toBe(2);
});

// TODO: Remove this / move to another endpoint
test("that users gets returned from graphql", async () => {
  await Promise.all(
    [{ userName: "test", firstName: "John" }].map(x =>
      new models.User(x).save()
    )
  );

  const res = await request(app)
    .post("/graphql")
    .send({ query: `{ users { userName, firstName } }` })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body).toStrictEqual({
    data: { users: [{ userName: "test", firstName: "John" }] }
  });
});
