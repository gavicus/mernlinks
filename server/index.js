const { GraphQLServer } = require('graphql-yoga')
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

const Link = mongoose.model("Link", {
    url: String,
    type: String,
});

const Subject = mongoose.model("Subject", {
    name: String,
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    links: [Link]
    subjects: [Subject]
  }
  type Link {
    id: ID!
    url: String!
    type: String!
  }
  type Subject {
    id: ID!
    name: String!
  }
  type Mutation {
    createLink(url: String!, type: String!): Link
    changeLink(id: ID!, url: String!, type: String!): Boolean
    removeLink(id: ID!): Boolean
    createSubject(name: String!): Subject
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    links: () => Link.find(),
    subjects: () => Subject.find(),
  },
  Mutation: {
    createLink: async (_, {url, type}) => {
        const link = new Link({url,type});
        await link.save();
        return link;
    },
    changeLink: async (_, {id, url, type}) => {
        await Link.findByIdAndUpdate(id, {url,type});
        return true;
    },
    removeLink: async (_, {id}) => {
        await Link.findByIdAndRemove(id);
        return true;
    },
    createSubject: async (_, {name}) => {
        const subject = new Subject({name});
        await subject.save();
        return subject;
    },
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open", function(){
    server.start(() => console.log('Server is running on localhost:4000'))
});
