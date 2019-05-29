const { GraphQLServer } = require('graphql-yoga')
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

const Link = mongoose.model("Link", {
    url: String,
    type: String,
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    links: [Link]
  }
  type Link {
    id: ID!
    url: String!
    type: String!
  }
  type Mutation {
    createLink(url: String!, type: String!): Link
    changeLinkType(id: ID!, type: String): Boolean
    removeLink(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    links: () => Link.find(),
  },
  Mutation: {
    createLink: async (_, {url, type}) => {
        const link = new Link({url,type});
        await link.save();
        return link;
    },
    changeLinkType: async (_, {id, type}) => {
        await Link.findByIdAndUpdate(id, {type});
        return true;
    },
    removeLink: async (_, {id}) => {
        await Link.findByIdAndRemove(id);
        return true;
    },
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open", function(){
    server.start(() => console.log('Server is running on localhost:4000'))
});
