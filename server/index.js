const { GraphQLServer } = require('graphql-yoga')
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/test");

const Subject = mongoose.model("Subject", {
    name: String,
});

const Link = mongoose.model("Link", {
    url: String,
    type: String,
    subjects: [Subject.schema],
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    links: [Link]
    subjects: [Subject]
  }
  type Subject {
    id: ID!
    name: String!
  }
  input SubjectInput {
    id: ID!
    name: String!
  }
  type Link {
    id: ID!
    url: String!
    type: String!
    subjects: [Subject]
  }
  input LinkInput {
    id: ID!
    url: String!
    type: String!
    subjects: [SubjectInput]
  }
  type Mutation {
    createLink(url: String!, type: String!): Link
    changeLink(id: ID!, url: String!, type: String!, subjects: [SubjectInput]): Boolean
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
    changeLink: async (_, {id, url, type, subjects}) => {
        await Link.findByIdAndUpdate(id, {url, type, subjects});
        return true;
    },
    removeLink: async (_, {id}) => {
        await Link.findByIdAndRemove(id);
        return true;
    },
    createSubject: async (_, {name}) => {
        const subject = new Subject({name});
        await subject.save();
        return link;
    },
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open", function(){
    server.start(() => console.log('Server is running on localhost:4000'))
});
