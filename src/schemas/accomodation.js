const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = require("graphql");
const { Accomodation } = require("../models");
const bcrypt = require('bcryptjs');

const AccomodationType = new GraphQLObjectType({
    name: "Accomodation",
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        city: { type: GraphQLString },
        address: { type: GraphQLString },
    }
});

const buildInputError = ({ message, ...extensions }) => {
  return Object.assign(
    new Error(message), { extensions: extensions || {}}
  )
}

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      accomodations: {
        type: GraphQLList(AccomodationType),
        resolve: (root, args, context, info) => {
          return Accomodation.find().exec();
        }
      },
    }
  }),
  mutation: new GraphQLObjectType({
    name: "Mutations",
    fields: {
      loginAccomodation: {
        type: AccomodationType,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_root, {
          email, password
        }) => {
          const user = await Accomodation.findOne({ email }).exec()
          if (!user) {
            throw buildInputError({
              message: 'Accomodation not found', field: "email"
            });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            throw buildInputError({
              message: 'Invalid password', field: "password"
            });
          }

          return user
        }
      },
      createAccomodation: {
        type: AccomodationType,
        args: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          description: { type: new GraphQLNonNull(GraphQLString) },
          city: { type: new GraphQLNonNull(GraphQLString) },
          address: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_root, {
          title, description, city, address
        }) => {
          return await new Accomodation({
            title, description, city, address
          }).save()
        }
      },
    }
  })
});
