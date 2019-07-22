const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema
} = require("graphql");
const { User } = require("../models");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  }
});

const UserLoginType = new GraphQLObjectType({
  name: "UserLogin",
  fields: {
    user: { type: UserType },
    jwtToken: { type: GraphQLString }
  }
});

const buildInputError = ({ message, ...extensions }) => {
  return Object.assign(new Error(message), { extensions: extensions || {} });
};

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      users: {
        type: GraphQLList(UserType),
        resolve: (root, args, context, info) => {
          return User.find().exec();
        }
      },
      user: {
        type: UserType,
        args: {
          userName: { type: GraphQLString }
        },
        resolve: (root, { userName }, _context, _info) => {
          return User.findOne({ userName: userName }).exec();
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutations",
    fields: {
      loginUser: {
        type: UserLoginType,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve: async (_root, { email, password }) => {
          const user = await User.findOne({ email }).exec();

          if (!user) {
            throw buildInputError({
              message: "User not found",
              field: "email"
            });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            throw buildInputError({
              message: "Invalid password",
              field: "password"
            });
          }

          const jwtToken = jsonwebtoken.sign(
            { username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          return {
            user,
            jwtToken
          };
        }
      },
      registerUser: {
        type: UserType,
        args: {
          userName: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
          firstName: { type: GraphQLString },
          lastName: { type: GraphQLString }
        },
        resolve: async (
          _root,
          { userName, email, password, firstName, lastName }
        ) => {
          if (await User.findOne({ userName }).exec()) {
            throw buildInputError({
              message: "Username already taken",
              field: "userName"
            });
          }

          if (await User.findOne({ email }).exec()) {
            throw buildInputError({
              message: "Email already taken",
              field: "email"
            });
          }

          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(password, salt);

          return await new User({
            userName,
            email,
            firstName,
            lastName,
            password: hash
          }).save();
        }
      }
    }
  })
});
