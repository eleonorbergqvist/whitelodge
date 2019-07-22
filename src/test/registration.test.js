const request = require("supertest");
const bcrypt = require("bcryptjs");
const models = require("../models");
const { app } = require("../index");
const testHelper = require("./testHelper");

beforeAll(() => testHelper.startDB());
afterAll(() => testHelper.stopDB());
afterEach(() => testHelper.cleanupDB());

test("that it is not possible to register if username is taken", async () => {
  await Promise.all([{ userName: "test" }].map(x => new models.User(x).save()));

  const query = `
    mutation {
      registerUser(
        userName: "test", email: "hello@example.com", password: "123"
      ){
        userName
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].extensions.field).toBe("userName");
});

test("that it is not possible to register if email is taken", async () => {
  await Promise.all(
    [{ userName: "test", email: "test@test.com" }].map(x =>
      new models.User(x).save()
    )
  );

  const query = `
    mutation {
      registerUser(
        userName: "unique-username", email: "test@test.com", password: "123"
      ){
        userName
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].extensions.field).toBe("email");
});

test("that it possible to register user", async () => {
  const query = `
    mutation {
      registerUser(
        userName: "test", email: "test@test.com", password: "123"
      ){
        userName, email
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors).toBe(undefined);
  expect(res.body).toStrictEqual({
    data: { registerUser: { userName: "test", email: "test@test.com" } }
  });
});

test("that email and username are saved in lowercase", async () => {
  const query = `
    mutation {
      registerUser(
        userName: "TEST", email: "TEST@test.com", password: "123"
      ){
        userName, email
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors).toBe(undefined);
  expect(res.body).toStrictEqual({
    data: { registerUser: { userName: "test", email: "test@test.com" } }
  });
});

test("that it is possible to login a registered user", async () => {
  const query = `
    mutation {
      registerUser(
        userName: "test", email: "test@test.com", password: "123"
      ){
        userName, email
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors).toBe(undefined);
  expect(res.body).toStrictEqual({
    data: { registerUser: { userName: "test", email: "test@test.com" } }
  });

  const loginQuery = `
    mutation {
      loginUser(
        email: "test@test.com", password: "123"
      ){
        user { userName, email }
      }
    }`;

  const loginRes = await request(app)
    .post("/graphql")
    .send({ query: loginQuery })
    .set("Accept", "application/json");

  expect(loginRes.statusCode).toBe(200);
  expect(loginRes.body.errors).toBe(undefined);
  expect(loginRes.body).toStrictEqual({
    data: { loginUser: { user: { userName: "test", email: "test@test.com" } } }
  });
});

test("that login without arguments fails", async () => {
  const query = `
    mutation {
      loginUser(){
        user { userName, email }
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(400);
  expect(res.body.errors.length).toBe(1);
});

test("that login with invalid email fails", async () => {
  const query = `
    mutation {
      loginUser(email: "hello@example.com", password: "123"){
        user { userName, email }
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].extensions.field).toBe("email");
});

test("that login with invalid password fails", async () => {
  await Promise.all(
    [{ userName: "test", email: "test@test.com", password: "abc" }].map(x =>
      new models.User(x).save()
    )
  );

  const query = `
    mutation {
      loginUser(email: "test@test.com", password: "123"){
        user { userName, email }
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body.errors.length).toBe(1);
  expect(res.body.errors[0].extensions.field).toBe("password");
});

test("that login with proper password works", async () => {
  const hash = bcrypt.hashSync("123", bcrypt.genSaltSync(10));

  await Promise.all(
    [{ userName: "test", email: "test@test.com", password: hash }].map(x =>
      new models.User(x).save()
    )
  );

  const query = `
    mutation {
      loginUser(email: "test@test.com", password: "123"){
        user { userName, email }
      }
    }`;

  const res = await request(app)
    .post("/graphql")
    .send({ query })
    .set("Accept", "application/json");

  expect(res.statusCode).toBe(200);
  expect(res.body).toStrictEqual({
    data: { loginUser: { user: { userName: "test", email: "test@test.com" } } }
  });
});
