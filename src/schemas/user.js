const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema
} = require("graphql");
const { User } = require("../models");

const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLID },
        userName: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString }
    }
});

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
                resolve: (root, args, context, info) => {
                    return User.findOne({ userName: args.userName }).exec();
                }
            }
        }
    })
});
